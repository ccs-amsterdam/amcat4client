import AggregateResultOptions from "./AggregateResultOptions";
import AggregateResult from "./AggregateResult";
import { useState } from "react";
import {
  AmcatUser,
  AggregationOptions,
  AmcatIndexName,
  AmcatQuery,
} from "@/amcat/interfaces";

const initialState: AggregationOptions = {
  display: "linechart",
  axes: [],
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
    <div>
      <div className="prose p-5 pb-0">
        <h3>Aggregate</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-3">
        <div className="flex justify-center p-5">
          <AggregateResultOptions
            user={user}
            index={index}
            query={query}
            options={options}
            setOptions={setOptions}
          />
        </div>
        <div className="w-full p-5">
          <AggregateResult
            user={user}
            index={index}
            query={query}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}
