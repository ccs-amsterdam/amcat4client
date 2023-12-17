import { AmcatQuery, AggregationOptions, AmcatIndexName } from "@/amcat/interfaces";
import { asPostAmcatQuery } from "./query";

import { MiddlecatUser } from "middlecat-react";

export function postAggregate(
  user: MiddlecatUser,
  index: AmcatIndexName,
  query: AmcatQuery,
  options: AggregationOptions,
) {
  const postAmcatQuery = asPostAmcatQuery(query);
  const params: any = {};
  if (options?.axes) params["axes"] = options.axes;
  if (options?.metrics) params["aggregations"] = options.metrics;
  return user.api.post(`index/${index}/aggregate`, {
    ...postAmcatQuery,
    ...params,
  });
}
