import { AmcatQuery, AggregationOptions, AmcatIndexName } from "@/interfaces";
import { postQuery } from "./query";

import { MiddlecatUser } from "middlecat-react";

export function postAggregate(
  user: MiddlecatUser,
  indexName: AmcatIndexName,
  query: AmcatQuery,
  options: AggregationOptions,
) {
  const params: any = {};
  if (options?.axes) params["axes"] = options.axes;
  if (options?.metrics) params["aggregations"] = options.metrics;
  return postQuery(user, indexName, query, params);
}
