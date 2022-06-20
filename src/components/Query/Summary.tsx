import {
  AggregateResult,
  AggregationInterval,
  AggregationOptions,
  Amcat,
  ArticleModal,
  Articles,
} from "amcat4react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Header } from "semantic-ui-react";
import { link_doc, useIndex } from "../../lib/navigation";
import { useAppSelector } from "../app/hooks";
import { selectQuery } from "./QuerySlice";

type Metric = { n: number; min_date: string; max_date: string };

export default function Summary() {
  const [id, setId] = useState<string>();
  const index = useIndex();
  const query = useAppSelector(selectQuery);
  const [metrics, setMetrics] = useState<Metric>();
  const path = useLocation().pathname;
  useEffect(() => {
    if (index == null) return;
    Amcat.postAggregate(index, query, {
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
  }, [index, query]);
  if (index == null) return null;

  let interval: AggregationInterval = "day";
  if (metrics) {
    const days =
      (new Date(metrics.max_date).getTime() -
        new Date(metrics.min_date).getTime()) /
      (24 * 60 * 60 * 1000);
    if (days > 30) interval = "week";
    if (days > 90) interval = "month";
    if (days > 600) interval = "year";
  }
  const options: AggregationOptions = {
    display: "linechart",
    axes: [{ field: "date", interval: interval }],
  };
  if (query?.queries && query.queries.length > 1)
    options.axes?.push({ field: "_query" });
  return (
    <Grid textAlign="left" stackable reversed="mobile">
      <Grid.Column width={10}>
        <Articles
          index={index}
          query={query}
          asSnippets
          allColumns={false}
          perPage={10}
          onClick={(row) => setId(row._id)}
        />
        {id == null ? null : (
          <ArticleModal
            index={index}
            query={query}
            id={id}
            link={window.location.href.replace(path, link_doc(index, id))}
            changeArticle={(x) => setId(x as any)}
          />
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        {metrics == null ? null : (
          <Header size="small">
            {metrics.n} Documents from {metrics.min_date?.substring(0, 10)} -{" "}
            {metrics.max_date?.substring(0, 10)}
          </Header>
        )}
        <AggregateResult
          index={index}
          query={query}
          options={options as AggregationOptions}
          height={300}
        />
      </Grid.Column>
    </Grid>
  );
}
