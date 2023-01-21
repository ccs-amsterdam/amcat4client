import AggregateResultOptions from "./AggregateResultOptions";
import AggregateResultConnector from "./AggregateResultConnector";
import { useState } from "react";
import {
  AmcatUser,
  AggregationOptions,
  AmcatIndexName,
  AmcatQuery,
} from "../../amcat4react";

const initialState: AggregationOptions = {
  display: "linechart",
  hold: true,
  axes: [{ field: "date", name: "date", interval: "month" }],
};

interface Props {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
}

export default function AggregateResultPanel({ user, index, query }: Props) {
  const [options, setOptions] = useState<AggregationOptions>(initialState);

  if (!user || !index || !query) return null;

  return (
    <>
      <AggregateResultOptions
        user={user}
        index={index}
        query={query}
        options={options}
        setOptions={setOptions}
      />
      <AggregateResultConnector
        user={user}
        index={index}
        query={query}
        options={options}
      />
    </>
  );
}
