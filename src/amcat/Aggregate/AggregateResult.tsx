import { useEffect, useState } from "react";
// import Articles from "../Articles/Articles";
import {
  AggregateData,
  AggregationInterval,
  AggregationOptions,
  AmcatFilter,
  AmcatIndexName,
  AmcatQuery,
  AmcatUser,
  DateFilter,
} from "@/amcat/interfaces";
import AggregateList from "./AggregateList";
import AggregateTable from "./AggregateTable";
import AggregateBarChart from "./AggregateBarChart";
import AggregateLineChart from "./AggregateLineChart";
import { postAggregate } from "@/amcat/api/aggregate";
import { describeError } from "@/amcat/api/error";
import { Loading } from "@/components/ui/loading";

//TODO: This file is becoming too complex - move some business logic to a lib and add unit tests?

interface AggregateResultProps {
  user: AmcatUser;
  index: AmcatIndexName;
  /** The query for the results to show */
  query: AmcatQuery;
  /** Aggregation options (display and axes information) */
  options: AggregationOptions;
  /* Width of the component */
  width?: string | number;
  /* Height of the component */
  height?: string | number;
  /* Optional scaling factor */
  scale?: number;
}

/**
 * Display the results of an aggregate search
 */
export default function AggregateResult({
  user,
  index,
  query,
  options,
  width,
  height,
  scale,
}: AggregateResultProps) {
  const [data, setData] = useState<AggregateData>();
  const [error, setError] = useState<string>();
  const [zoom, setZoom] = useState();

  // Fetch data and return an error message if it fails
  useEffect(() => {
    // Prevent data/error being set after component is unmounted
    let cancel = false;
    // TODO: don't query if index changed but options hasn't been reset (yet)
    if (index == null || !options?.axes || options.axes.length === 0) {
      setData(undefined);
      setError(undefined);
    } else {
      postAggregate(user, index, query, options)
        .then((d) => {
          if (!cancel) {
            setData(d.data);
            setError(undefined);
          }
        })
        .catch((error) => {
          if (!cancel) {
            setData(undefined);
            setError(describeError(error));
          }
        });
    }
    return () => {
      cancel = true;
    };
  }, [user, index, options, query]);
  <AggregateResult
    user={user}
    index={index}
    query={query}
    options={options as AggregationOptions}
    height={300}
  />;
  if (error) return <span className="text-red-600">{error}</span>;

  if (!options)
    return (
      <span className="italic text-center">Select aggregation options</span>
    );
  if (!data || !options || !options.display)
    return <Loading msg={`Loading aggregation`} />;

  // Handle a click on the aggregate result
  // values should be an array of the same length as the axes and identify the value for each axis
  const handleClick = (values: any[]) => {
    if (!options.axes || options.axes.length !== values.length)
      throw new Error(
        `Axis [${JSON.stringify(
          options.axes
        )}] incompatible with values [${values}]`
      );
    // Create a new query to filter articles based on intersection of current and new query
    const newQuery = query == null ? {} : JSON.parse(JSON.stringify(query));
    if (!newQuery.filters) newQuery.filters = {};
    options.axes.forEach((axis, i) => {
      if (axis.field === "_query") {
        if (!query.queries) return;
        newQuery.queries = [query.queries[values[i]]];
      } else {
        newQuery.filters[axis.field] = getZoomFilter(
          values[i],
          axis.interval,
          newQuery.filters?.[axis.field]
        );
      }
    });
    setZoom(newQuery);
  };
  const scaled_data =
    scale == null
      ? data
      : { ...data, data: data.data.map((x) => ({ ...x, n: x.n * scale })) };

  // Choose and render result element
  const Element = {
    list: AggregateList,
    table: AggregateTable,
    barchart: AggregateBarChart,
    linechart: AggregateLineChart,
  }[options.display];
  if (Element === undefined) {
    console.error({ Element, data, options });
    return (
      <span className="text-orange-500">{`Unknown display option: ${options.display}`}</span>
    );
  }
  return (
    <div>
      {options.title ? (
        <h3 className="text-center font-bold text-lg max-w-none prose mb-3 mt-2">
          {options.title}
        </h3>
      ) : null}
      {getArticleList(user, index, zoom, () => setZoom(undefined))}
      <Element
        data={scaled_data}
        onClick={handleClick}
        width={width}
        height={height}
        limit={options.limit}
      />
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
  value: any,
  interval: AggregationInterval | undefined,
  existing: AmcatFilter
) {
  // For regular values, we can directly filter
  // Existing filter can also never be stricter than the value
  if (!interval) return { values: [value] };
  // For intervals/dates, we need to compute a start/end date
  // and then combine it with possible existing filters
  let start = new Date(value);
  let end = getEndDate(start, interval);
  // I tried a fancy list filter max expression but that just complicates stuff
  // for reference: new Date(Math.max(...[start, gte, gt].filter((x) => x != null).map((x) => new Date(x))))
  if (existing?.gte)
    start = new Date(
      Math.max(start.getTime(), new Date(existing.gte).getTime())
    );
  if (existing?.gt)
    start = new Date(
      Math.max(start.getTime(), new Date(existing.gt).getTime())
    );
  if (existing?.lt)
    end = new Date(Math.min(end.getTime(), new Date(existing.lt).getTime()));
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

function describe_filter(field: string, filter: AmcatFilter | undefined) {
  if (!filter) return "";
  if (filter.values) return `${field} '${filter.values}'`;
  const descriptions: { [key: string]: string } = {
    lte: "≤",
    lt: "<",
    gte: "≥",
    gt: ">",
  };
  return (Object.keys(filter) as (keyof DateFilter)[])
    .map((f) => `${field} ${descriptions[f]} ${filter[f]}`)
    .join(" and ");
}

export function getArticleList(
  user: AmcatUser,
  index: AmcatIndexName,
  query: AmcatQuery | undefined,
  onClose: () => void
) {
  if (!query) return null;
  const header = Object.keys(query.filters || {})
    .map((f) => describe_filter(f, query.filters?.[f]))
    .join(" and ");

  return null;
  // return (
  //   <Modal open onClose={onClose}>
  //     <Modal.Header>{`Articles for ${header}`}</Modal.Header>
  //     <Articles user={user} index={index} query={query} />
  //   </Modal>
  // );
}
