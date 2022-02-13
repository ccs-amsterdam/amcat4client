import { AggregateResult, AggregationOptions, Articles } from "amcat4react";
import { useAppSelector } from "./app/hooks";
import { selectIndex } from "./Menu/LoginSlice";
import { selectQuery } from "./Query/QuerySlice";

export default function Summary() {
  const index = useAppSelector(selectIndex);
  const query = useAppSelector(selectQuery);
  if (index == null) return null;
  const options = {
    display: "linechart",
    axes: [{ field: "date", interval: "week" }],
  };
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
