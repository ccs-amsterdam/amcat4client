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
  return <AggregateResult index={index} options={options} query={query} />;
}
