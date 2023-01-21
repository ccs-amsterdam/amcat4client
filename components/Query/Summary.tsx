import {
  AggregateResult,
  AggregationInterval,
  AggregationOptions,
  Amcat,
  AmcatIndexName,
  Articles,
  AmcatQuery,
  AmcatUser,
} from "../../amcat4react";

import { useEffect, useState } from "react";
import { Grid, Header } from "semantic-ui-react";

export type Metric = { n: number; min_date: string; max_date: string };

interface SummaryProps {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
}

export default function Summary({ user, index, query }: SummaryProps) {
  const [metrics, setMetrics] = useState<Metric>();

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
  }, [user, index, query]);
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
        {metrics == null ? null : (
          <Header size="small">
            {metrics.n} Documents from {metrics.min_date?.substring(0, 10)} -{" "}
            {metrics.max_date?.substring(0, 10)}
          </Header>
        )}
        <AutoAggregateResults
          user={user}
          index={index}
          query={query}
          metrics={metrics}
        />
      </Grid.Column>
    </Grid>
  );
}

interface AutoAggregateProps {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
  metrics: Metric | undefined;
}

function AutoAggregateResults({
  user,
  index,
  query,
  metrics,
}: AutoAggregateProps) {
  if (!metrics) return null;

  let interval: AggregationInterval = "day";

  const days =
    (new Date(metrics.max_date).getTime() -
      new Date(metrics.min_date).getTime()) /
    (24 * 60 * 60 * 1000);
  if (days > 30) interval = "week";
  if (days > 90) interval = "month";
  if (days > 600) interval = "year";

  const options: AggregationOptions = {
    display: "linechart",
    axes: [{ name: "date", field: "date", interval }],
  };

  if (query?.queries && Object.keys(query.queries).length > 1)
    options.axes?.push({ name: "", field: "_query" });

  return (
    <AggregateResult
      user={user}
      index={index}
      query={query}
      options={options as AggregationOptions}
      height={300}
    />
  );
}
