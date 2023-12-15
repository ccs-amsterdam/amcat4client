import {
  AmcatIndexName,
  AmcatQuery,
  AmcatUser,
  AggregationOptions,
} from "@/amcat/interfaces";
import { asPostAmcatQuery } from "./query";

export function postAggregate(
  user: AmcatUser,
  index: AmcatIndexName,
  query: AmcatQuery,
  options: AggregationOptions
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
