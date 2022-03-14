import { AggregateResult } from "amcat4react";
import { useAppSelector } from "../app/hooks";
import { selectIndex } from "../Menu/LoginSlice";
import { selectQuery } from "../Query/QuerySlice";
import { selectOptions } from "./AggregateSlice";

export default function AggregateResultConnector() {
  const query = useAppSelector(selectQuery);
  const options = useAppSelector(selectOptions);
  const index = useAppSelector(selectIndex);
  if (index == null) return null;
  return (
    <div
      style={{
        width: "100%",
        maxHeight: "800px",
        overflowX: "auto",
        overflowY: "auto",
      }}
    >
      <AggregateResult index={index} options={options} query={query} />
    </div>
  );
}
