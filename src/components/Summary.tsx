import { AggregateResult, AggregationOptions, Articles } from "amcat4react";
import { useAppSelector } from "./app/hooks";
import { selectIndex } from "./Menu/LoginSlice";
import { selectQuery } from "./Query/QuerySlice";

export default function Summary() {
  const index = useAppSelector(selectIndex);
  const query = useAppSelector(selectQuery);
  if (index == null) return null;
  const options: AggregationOptions = {
    display: "linechart",
    axes: [{ field: "date", interval: "week" }],
  };
  if (query?.queries && query.queries.length > 1)
    options.axes.push({ field: "_query" });
  return (
    <>
      <AggregateResult
        index={index}
        query={query}
        options={options as AggregationOptions}
        height={300}
      />
      <Articles index={index} query={query} />
    </>
  );
}
