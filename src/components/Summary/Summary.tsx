import Articles from "../Articles/Articles";
import { MiddlecatUser } from "middlecat-react";
import { AggregationAxis, AmcatField, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { useFields } from "@/api/fields";
import AggregateResult from "../Aggregate/AggregateResult";
import { useMemo } from "react";
import { useFieldValues } from "@/api/fieldValues";
import { useFieldStats } from "@/api/fieldStats";
import { autoFormatDate } from "@/lib/autoFormatDate";

interface Props {
  user: MiddlecatUser;
  indexName: AmcatIndexId;
  query: AmcatQuery;
}

export default function Summary({ user, indexName, query }: Props) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexName);

  function renderVisualization(field: AmcatField) {
    if (!field.client_settings.inListSummary) return null;
    if (field.type === "date")
      return <DateSummaryGraph key={field.name} user={user} indexName={indexName} query={query} field={field} />;
    if (field.type === "keyword")
      return <KeywordSummaryGraph key={field.name} user={user} indexName={indexName} query={query} field={field} />;
  }

  return (
    <div className="grid snap-x snap-mandatory grid-cols-[100%,100%] gap-1 overflow-auto md:grid-cols-2 md:gap-3">
      <div className=" border-foreground/31 snap-center overflow-auto  rounded-l">
        <Articles user={user} indexName={indexName} query={query} />
      </div>
      <div className="flex snap-center flex-col gap-3  md:gap-6">
        {(fields || []).map((field) => {
          return <div key={field.name}>{renderVisualization(field)}</div>;
        })}
      </div>
    </div>
  );
}

interface SummaryProps extends Props {
  field: AmcatField;
}

function DateSummaryGraph({ user, indexName, query, field }: SummaryProps) {
  const { data: values, isLoading: valuesLoading } = useFieldStats(user, indexName, field.name);

  const axes = useMemo(() => {
    if (!values) return [];
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
      indexName={indexName}
      query={query}
      options={{ axes, display: "linechart", title: field.name.toUpperCase() }}
    />
  );
}

function KeywordSummaryGraph({ user, indexName, query, field }: SummaryProps) {
  const axes = useMemo(() => {
    const axes: AggregationAxis[] = [{ name: field.name, field: field.name }];
    if (query.queries && query.queries.length > 0) axes.push({ name: "_query", field: "_query" });
    return axes;
  }, [field, query]);

  return (
    <AggregateResult
      user={user}
      indexName={indexName}
      query={query}
      options={{ axes, display: "barchart", title: field.name.toUpperCase() }}
    />
  );
}
