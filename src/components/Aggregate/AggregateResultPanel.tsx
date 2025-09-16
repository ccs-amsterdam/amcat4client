import AggregateResultOptions from "./AggregateResultOptions";
import AggregateResult from "./AggregateResult";
import { useState } from "react";
import { AggregationOptions, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";

const initialState: AggregationOptions = {
  display: "linechart",
  axes: [],
};

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
}

export default function AggregateResultPanel({ user, indexId, query }: Props) {
  const [options, setOptions] = useState<AggregationOptions>(initialState);
  options.display;

  function defaultPageSize() {
    if (options.display === "linechart") return 200;
    if (options.display === "barchart") return 20;
    if (options.display === "table") return 50;
    if (options.display === "list") return 20;
  }

  if (!user || !indexId || !query) return null;

  return (
    <div>
      <div className="prose p-5 pb-0 dark:prose-invert">
        <h3>Aggregate</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[auto,1fr]">
        <div className="flex justify-center p-5">
          <AggregateResultOptions
            user={user}
            indexId={indexId}
            query={query}
            options={options}
            setOptions={setOptions}
          />
        </div>
        <div className="w-full p-5">
          <AggregateResult
            user={user}
            indexId={indexId}
            query={query}
            options={options}
            defaultPageSize={defaultPageSize()}
          />
        </div>
      </div>
    </div>
  );
}
