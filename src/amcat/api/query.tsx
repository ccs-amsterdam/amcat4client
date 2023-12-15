import {
  AmcatIndexName,
  AmcatQuery,
  AmcatUser,
  PostAmcatQuery,
} from "@/amcat/interfaces";

export function postQuery(
  user: AmcatUser,
  index: AmcatIndexName,
  query: AmcatQuery,
  params: any
) {
  const postAmcatQuery = asPostAmcatQuery(query);
  return user.api.post(`index/${index}/query`, {
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
  if (query.filters) postAmcatQuery.filters = { ...query.filters };
  return postAmcatQuery;
}
