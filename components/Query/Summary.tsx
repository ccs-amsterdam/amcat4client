import {
  AggregateResult,
  AggregationInterval,
  AggregationOptions,
  Amcat,
  AmcatIndexName,
  Articles,
  AmcatQuery,
  AmcatUser,
  AggregationMetric,
} from "../../amcat4react";

import { useEffect, useState } from "react";
import { Grid, Header } from "semantic-ui-react";
import { getField, useFields } from "../../amcat4react/Amcat";
import { useIndexDetailsQuery } from "../../amcat4react/hooks/useIndexDetails";

export type Metric = { n: number; min_date: string; max_date: string };

interface SummaryProps {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
}

export default function Summary({ user, index, query }: SummaryProps) {
  if (index == null) return null;

  return (
    <Grid textAlign="left" stackable reversed="mobile">
      <Grid.Column width={10}>
        <Articles
          user={user}
          index={index}
          query={query}
          asSnippets
          allColumns={false}
          perPage={10}
          sort={[{ date: { order: "desc" } }]}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        <AutoAggregateResults user={user} index={index} query={query} />
      </Grid.Column>
    </Grid>
  );
}

interface AutoAggregateProps {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
}

function AutoAggregateResults({ user, index, query }: AutoAggregateProps) {
  const [metrics, setMetrics] = useState<Metric>();
  const fields = useFields(user, index);
  const indexDetails = useIndexDetailsQuery(index);

  useEffect(() => {
    if (index == null) return;

    Amcat.postAggregate(user, index, query, {
      display: "linechart",
      metrics: [
        { field: "date", function: "min" },
        { field: "date", function: "max" },
      ],
      axes: [],
    })
      .then((d) => {
        setMetrics(d.data.data[0]);
      })
      .catch((e) => {
        console.log("Error in getting aggregate statistics");
      });
  }, [user, index, query, fields]);

  if (!metrics || !fields || !indexDetails) return null;
  const field = indexDetails.data?.summary_field == null ? "date" : indexDetails.data?.summary_field;
  const ftype = getField(fields, field)?.type;

  console.log(indexDetails.data?.summary_field);
  let options: AggregationOptions;

  if (ftype === "date") {
    let interval: AggregationInterval = "day";
    const days = (new Date(metrics.max_date).getTime() - new Date(metrics.min_date).getTime()) / (24 * 60 * 60 * 1000);
    if (days > 30) interval = "week";
    if (days > 90) interval = "month";
    if (days > 600) interval = "year";

    options = {
      display: "linechart",
      axes: [{ name: "date", field: "date", interval }],
    };
  } else {
    options = {
      display: "barchart",
      axes: [{ name: field, field: field }],
    };
  }

  if (query?.queries && Object.keys(query.queries).length > 1) options.axes?.push({ name: "", field: "_query" });

  return (
    <>
      {metrics == null ? null : (
        <Header size="small">
          {metrics.n} Documents from {metrics.min_date?.substring(0, 10)} - {metrics.max_date?.substring(0, 10)}
        </Header>
      )}
      <AggregateResult user={user} index={index} query={query} options={options as AggregationOptions} height={300} />
    </>
  );
}
