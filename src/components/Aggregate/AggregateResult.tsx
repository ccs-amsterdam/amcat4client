import { useEffect, useMemo, useState } from "react";
// import Articles from "../Articles/Articles";
import {
  AggregateData,
  AggregationInterval,
  AggregationOptions,
  AmcatFilter,
  AmcatIndexId,
  AmcatQuery,
  DateFilter,
} from "@/interfaces";
import AggregateList from "./AggregateList";
import AggregateTable from "./AggregateTable";
import AggregateBarChart from "./AggregateBarChart";
import AggregateLineChart from "./AggregateLineChart";
import { useAggregate } from "@/api/aggregate";
import { Loading } from "@/components/ui/loading";
import { MiddlecatUser } from "middlecat-react";
import { ErrorMsg } from "../ui/error-message";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import useCreateChartData from "./useCreateChartData";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import Articles from "../Articles/Articles";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";

interface AggregateResultProps {
  user: MiddlecatUser;
  indexName: AmcatIndexId;
  /** The query for the results to show */
  query: AmcatQuery;
  /** Aggregation options (display and axes information) */
  options: AggregationOptions;
  /* Width of the component */
  width?: string | number;
  /* Height of the component */
  height?: string | number;
}

/**
 * Display the results of an aggregate search
 */
export default function AggregateResult({ user, indexName, query, options, width, height }: AggregateResultProps) {
  const {
    data: infiniteData,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
  } = useAggregate(user, indexName, query, options);
  const [zoom, setZoom] = useState<AmcatQuery>();

  const data: AggregateData | null = useMemo(() => {
    // combine results form infiniteQuery pages.
    // We can just use the first meta, because we only use the parts
    // that are the same across all pages.
    const meta = infiniteData?.pages[0].meta;
    if (!meta) return null;

    const data = infiniteData?.pages.flatMap((page) => page.data);
    return { meta, data };
  }, [infiniteData]);

  const [chartData, status] = useCreateChartData(data, true);

  if (error) return <ErrorMsg>Could not aggregate data</ErrorMsg>;
  if (isLoading) return <Loading msg="Loading aggregation" />;

  if (!options) return <span className="text-center italic">Select aggregation options</span>;
  if (!chartData || !options || !options.display) return null;

  // Handle a click on the aggregate result
  // values should be an array of the same length as the axes and identify the value for each axis
  const handleClick = (values: (number | string)[]) => {
    if (!options.axes || options.axes.length !== values.length)
      throw new Error(`Axis [${JSON.stringify(options.axes)}] incompatible with values [${values}]`);
    // Create a new query to filter articles based on intersection of current and new query
    const newQuery: AmcatQuery = query == null ? {} : JSON.parse(JSON.stringify(query));
    if (!newQuery.filters) newQuery.filters = {};
    let invalid = false;
    options.axes.forEach((axis, i: number) => {
      if (axis.field === "_query") {
        if (!query.queries) return;
        newQuery.queries = [query.queries[Number(values[i])]];
      } else {
        if (!newQuery.filters) return;
        const filter = getZoomFilter(values[i], axis.interval, newQuery.filters?.[axis.field]);
        if (filter == undefined) {
          invalid = true;
          return;
        }
        newQuery.filters[axis.field] = filter;
      }
    });
    if (invalid) {
      toast.error("Zooming in on this type of value is not supported");
      return;
    }
    setZoom(newQuery);
  };
  // Choose and render result element
  const Visualization = {
    list: AggregateList,
    table: AggregateTable,
    barchart: AggregateBarChart,
    linechart: AggregateLineChart,
  }[options.display];
  if (Visualization === undefined) {
    console.error({ Visualization, data, options });
    return <span className="text-orange-500">{`Unknown display option: ${options.display}`}</span>;
  }

  return (
    <div className="relative">
      <div className={`pointer-events-none absolute right-0 top-0 z-50  `}>
        {options.title ? (
          <h3 className="mr-[6px] mt-[6px] max-w-none rounded-bl-md  border-foreground bg-background/50 py-1 pl-2 pr-2  font-semibold backdrop-blur-[1px]">
            {options.title}
          </h3>
        ) : null}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              className={`pointer-events-auto bg-destructive/60 shadow-md shadow-foreground/30 hover:bg-destructive ${
                hasNextPage ? "block" : "hidden"
              }`}
              onClick={() => fetchNextPage()}
            >
              Load more
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="w-72 max-w-[50vw] bg-background">
            <p>
              This aggregation has a lot of datapoints, so not all data can be requested at once. If you want to see
              more, click this button.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="relative z-40">
        <Visualization data={chartData} onClick={handleClick} width={width} height={height} limit={options.limit} />
      </div>
      <ArticleListModal user={user} index={indexName} query={zoom} onClose={() => setZoom(undefined)} />
    </div>
  );
}

/**
 * Compute the right filter for 'zooming in' to a clicked cell/bar/point.
 * Should always yield exactly the same (number of) articles as visible in the cell.
 *
 * @param {*} value the clicked value, e.g. a date or keyword value
 * @param {str} interval the selected interval, e.g. null or week/month etc
 * @param {object} existing the existing filters for this field, e.g. null or lte and/or gte filters
 * @returns the filter object with either a values filter or a (possibly merged) date filter
 */
function getZoomFilter(
  value: string | number,
  interval: AggregationInterval | undefined,
  existing: AmcatFilter,
): AmcatFilter | undefined {
  // For regular values, we can directly filter
  // Existing filter can also never be stricter than the value
  if (!interval) return { values: [value] };

  // For dates, currently only from/to intervalls supported, not cycles (e.g., day of the week)
  if (!["day", "week", "month", "quarter", "year"].includes(interval)) return undefined;

  // For intervals/dates, we need to compute a start/end date
  // and then combine it with possible existing filters

  let start = new Date(value);
  let end = getEndDate(start, interval);
  // I tried a fancy list filter max expression but that just complicates stuff
  // for reference: new Date(Math.max(...[start, gte, gt].filter((x) => x != null).map((x) => new Date(x))))
  if (existing?.gte) start = new Date(Math.max(start.getTime(), new Date(existing.gte).getTime()));
  if (existing?.gt) start = new Date(Math.max(start.getTime(), new Date(existing.gt).getTime()));
  if (existing?.lt) end = new Date(Math.min(end.getTime(), new Date(existing.lt).getTime()));
  // Now it becomes interesting. We normally set end of the interval to LT
  // However, if existing.lte "wins", we should also set our end to be LTE.
  let end_op = "lt";
  if (existing?.lte && new Date(existing?.lte) < end) {
    end = new Date(existing.lte);
    end_op = "lte";
  }
  return { gte: isodate(start), [end_op]: isodate(end) };
}

function getEndDate(start: Date, interval: AggregationInterval) {
  const result = new Date(start);
  switch (interval) {
    case "day":
    case "dayofweek":
      result.setDate(result.getDate() + 1);
      break;
    case "week":
      result.setDate(result.getDate() + 7);
      break;
    case "month":
      result.setMonth(result.getMonth() + 1);
      break;
    case "quarter":
      result.setMonth(result.getMonth() + 3);
      break;
    case "year":
      result.setFullYear(result.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unknown interval: ${interval}`);
  }
  return new Date(result);
}

function isodate(date: Date) {
  return date.toISOString().split("T")[0];
}

function describe_filter(filter: AmcatFilter | undefined) {
  if (!filter) return "";
  if (filter.values) return `${filter.values.join(", ")}`;

  let description = "";
  if (filter.gte) description = `>= ${filter.gte}`;
  if (filter.gt) description = `> ${filter.gt}`;
  if (filter.lte) description += `${description ? " and " : ""} <= ${filter.lte}`;
  if (filter.lt) description += `${description ? " and " : ""} < ${filter.lt}`;
  return description;
}

function ArticleListModal({
  user,
  index,
  query,
  onClose,
}: {
  user: MiddlecatUser;
  index: AmcatIndexId;
  query: AmcatQuery | undefined;
  onClose: () => void;
}) {
  if (!query) return null;

  return (
    <Dialog
      open={!!query}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-[750px] max-w-[90vw]">
        <DialogHeader className="border-b border-secondary pb-3">
          {Object.entries(query.filters || {}).map(([field, filter]) => (
            <p key={field} className="max-w-[700px]">
              <span className="mr-2 font-bold">{field}</span>{" "}
              <span className="round rounded bg-secondary px-1 text-secondary-foreground">
                {describe_filter(filter)}
              </span>
            </p>
          ))}
        </DialogHeader>
        <Articles user={user} indexName={index} query={query} />
      </DialogContent>
    </Dialog>
  );
}
