import { AmcatQuery, AmcatIndexName, AmcatFilters, AmcatQueryParams } from "@/interfaces";
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
