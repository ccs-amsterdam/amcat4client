import { AmcatQuery, AggregationOptions, AmcatIndexId } from "@/interfaces";
import { postAggregateQuery, postQuery } from "./query";

import { MiddlecatUser } from "middlecat-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { amcatAggregateDataSchema } from "@/schemas";

export function useAggregate(
  user: MiddlecatUser,
  indexName: AmcatIndexId,
  query: AmcatQuery,
  options: AggregationOptions,
) {
  return useInfiniteQuery({
    queryKey: ["aggregate", user, indexName, query, options],
    queryFn: ({ pageParam }) => postAggregate(user, indexName, query, options, pageParam),
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      return lastPage?.meta?.after;
    },
    enabled: !!user && !!indexName && !!query && !!options?.axes && options.axes.length > 0,
  });
}

async function postAggregate(
  user: MiddlecatUser,
  indexName: AmcatIndexId,
  query: AmcatQuery,
  options: AggregationOptions,
  pageParam: Record<string, any>,
) {
  const res = await postAggregateQuery(user, indexName, { ...options, after: pageParam }, query);
  return amcatAggregateDataSchema.parse(res.data);
}
