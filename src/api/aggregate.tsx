import { AmcatQuery, AggregationOptions, AmcatIndexId } from "@/interfaces";
import { postAggregateQuery, postQuery } from "./query";

import { MiddlecatUser } from "middlecat-react";
import { useQuery } from "@tanstack/react-query";
import { amcatAggregateDataSchema } from "@/schemas";

export function useAggregate(
  user: MiddlecatUser,
  indexName: AmcatIndexId,
  query: AmcatQuery,
  options: AggregationOptions,
) {
  return useQuery({
    queryKey: ["aggregate", user, indexName, query, options],
    queryFn: () => postAggregate(user, indexName, query, options),
    enabled: !!user && !!indexName && !!query && !!options?.axes && options.axes.length > 0,
  });
}

async function postAggregate(
  user: MiddlecatUser,
  indexName: AmcatIndexId,
  query: AmcatQuery,
  options: AggregationOptions,
) {
  const params: any = {};
  if (options?.axes) params["axes"] = options.axes;
  if (options?.metrics) params["aggregations"] = options.metrics;

  const res = await postAggregateQuery(user, indexName, options, query);
  return amcatAggregateDataSchema.parse(res.data);
}
