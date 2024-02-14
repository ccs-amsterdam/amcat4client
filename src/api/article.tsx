import { useQuery } from "@tanstack/react-query";
import { amcatQueryResultSchema } from "@/schemas";
import { AmcatIndexId, AmcatQuery, AmcatQueryParams } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { addFilter } from "@/api/util";
import { postQuery } from "./query";

export function useArticle(
  user: MiddlecatUser,
  indexName: AmcatIndexId,
  articleId: string,
  query?: AmcatQuery,
  params?: AmcatQueryParams,
  indexRole?: string,
) {
  return useQuery({
    queryKey: ["article", user, indexName, articleId, query, params, indexRole],
    queryFn: () => getArticle(user, indexName, articleId, query, params),
    enabled: !!user && !!indexName && !!articleId,
  });
}

async function getArticle(
  user: MiddlecatUser,
  indexName: AmcatIndexId,
  articleId: string,
  query?: AmcatQuery,
  params?: AmcatQueryParams,
) {
  let q = query || {};
  q = addFilter(q, { _id: { values: [articleId] } });
  const res = await postQuery(user, indexName, q, params);
  const queryResult = amcatQueryResultSchema.parse(res.data);
  return queryResult.results[0];
}
