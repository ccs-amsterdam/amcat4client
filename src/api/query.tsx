import { AmcatQuery, AmcatIndexName, AmcatFilters, AmcatQueryParams, AggregationOptions } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";

export interface PostAmcatQuery {
  filters?: AmcatFilters;
  queries?: Record<string, string>;
}

export function postQuery(
  user: MiddlecatUser,
  indexName: AmcatIndexName,
  query?: AmcatQuery,
  params?: AmcatQueryParams,
) {
  const postAmcatQuery = query ? asPostAmcatQuery(query) : undefined;
  return user.api.post(`index/${indexName}/query`, {
    ...postAmcatQuery,
    ...params,
  });
}

export function postAggregateQuery(
  user: MiddlecatUser,
  indexName: AmcatIndexName,
  options: AggregationOptions,
  query?: AmcatQuery,
) {
  const postAmcatQuery = query ? asPostAmcatQuery(query) : undefined;

  const postOptions: any = { axes: options.axes };
  if (options.metrics)
    postOptions.aggregations = options.metrics.map((m) => {
      return { field: m.field, function: m.function, name: m.name || m.field };
    });

  return user.api.post(`index/${indexName}/aggregate`, {
    ...postAmcatQuery,
    ...postOptions,
  });
}

export function asPostAmcatQuery(query: AmcatQuery) {
  const postAmcatQuery: PostAmcatQuery = {};
  if (query.queries) {
    query.queries.forEach((q) => {
      if (!postAmcatQuery.queries) postAmcatQuery.queries = {};
      postAmcatQuery.queries[q.label || q.query] = q.query;
    });
  }
  if (query.filters) {
    postAmcatQuery.filters = { ...query.filters };
    Object.keys(postAmcatQuery.filters).forEach((key) => {
      delete postAmcatQuery.filters?.[key].justAdded;
    });
  }

  return postAmcatQuery;
}
