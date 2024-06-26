import Articles from "../Articles/Articles";
import { MiddlecatUser } from "middlecat-react";
import { AggregationAxis, AmcatField, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { useFields } from "@/api/fields";
import AggregateResult from "../Aggregate/AggregateResult";
import { useMemo } from "react";
import { useFieldValues } from "@/api/fieldValues";
import { useFieldStats } from "@/api/fieldStats";
import { autoFormatDate } from "@/lib/autoFormatDate";
import { useHasIndexRole } from "@/api";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
}

export default function Summary({ user, indexId, query }: Props) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexId);
  const isWriter = useHasIndexRole(user, indexId, "WRITER");
  function renderVisualization(field: AmcatField) {
    if (!field.client_settings.inListSummary) return null;
    if (field.type === "date")
      return <DateSummaryGraph key={field.name} user={user} indexId={indexId} query={query} field={field} />;
    if (field.type === "keyword")
      return <KeywordSummaryGraph key={field.name} user={user} indexId={indexId} query={query} field={field} />;
  }
  const visualizations = (fields || []).map(renderVisualization).filter((el) => el != null);
  return (
    <div className="grid snap-x snap-mandatory grid-cols-[100%,100%] gap-1 overflow-auto md:grid-cols-2 md:gap-3 md:overflow-visible">
      <div className="border-foreground/31 snap-center  rounded-l">
        <Articles user={user} indexId={indexId} query={query} />
      </div>
      <div className="mt-12 flex snap-center flex-col  gap-3 md:gap-6">
        {visualizations.length === 0 ? (
          <div className="w-full flex-auto px-10 py-14 text-xl text-primary">
            {isWriter ? <a href="./settings">Enable visualizations in field settings</a> : null}
          </div>
        ) : (
          visualizations
        )}
      </div>
    </div>
  );
}

interface SummaryProps extends Props {
  field: AmcatField;
}

function DateSummaryGraph({ user, indexId, query, field }: SummaryProps) {
  const { data: values, isLoading: valuesLoading } = useFieldStats(user, indexId, field.name);

  const axes = useMemo(() => {
    if (!values?.max_as_string || !values.min_as_string) return [];
    const minTime = new Date(values.min_as_string).getTime();
    const maxTime = new Date(values.max_as_string).getTime();
    const interval = autoFormatDate(minTime, maxTime, 20);
    const axes: AggregationAxis[] = [{ name: field.name, field: field.name, interval }];
    if (query.queries && query.queries.length > 0) axes.push({ name: "_query", field: "_query" });
    return axes;
  }, [values, field, query]);

  if (valuesLoading) return <div>Loading...</div>;
  if (!values) return null;

  return (
    <AggregateResult
      user={user}
      indexId={indexId}
      query={query}
      options={{ axes, display: "linechart", title: field.name.toUpperCase() }}
      defaultPageSize={100}
    />
  );
}

function KeywordSummaryGraph({ user, indexId, query, field }: SummaryProps) {
  const axes = useMemo(() => {
    const axes: AggregationAxis[] = [{ name: field.name, field: field.name }];
    if (query.queries && query.queries.length > 0) axes.push({ name: "_query", field: "_query" });
    return axes;
  }, [field, query]);

  return (
    <AggregateResult
      user={user}
      indexId={indexId}
      query={query}
      options={{ axes, display: "barchart", title: field.name.toUpperCase() }}
      defaultPageSize={10}
    />
  );
}
