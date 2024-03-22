import { AmcatQuery, AggregationOptions, AmcatIndexId } from "@/interfaces";
import { postAggregateQuery, postQuery } from "./query";

import { MiddlecatUser } from "middlecat-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { amcatAggregateDataSchema } from "@/schemas";

export function useAggregate(
  user: MiddlecatUser,
  indexId: AmcatIndexId,
  query: AmcatQuery,
  options: AggregationOptions,
) {
  return useInfiniteQuery({
    queryKey: ["aggregate", user, indexId, query, options],
    queryFn: ({ pageParam }) => postAggregate(user, indexId, query, options, pageParam),
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      return lastPage?.meta?.after;
    },

    enabled: !!user && !!indexId && !!query && !!options?.axes && options.axes.length > 0,
  });
}

async function postAggregate(
  user: MiddlecatUser,
  indexId: AmcatIndexId,
  query: AmcatQuery,
  options: AggregationOptions,
  pageParam: Record<string, any>,
) {
  const res = await postAggregateQuery(user, indexId, { ...options, after: pageParam }, query);
  return amcatAggregateDataSchema.parse(res.data);
}
