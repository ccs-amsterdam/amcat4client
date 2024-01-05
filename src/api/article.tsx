import { useQuery } from "@tanstack/react-query";
import { amcatQueryResultSchema } from "@/schemas";
import { AmcatIndexName, AmcatQuery } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { addFilter } from "@/api/util";
import { postQuery } from "./query";

export function useArticle(user: MiddlecatUser, indexName: AmcatIndexName, articleId: string, query?: AmcatQuery) {
  return useQuery({
    queryKey: ["article", user, indexName, articleId],
    queryFn: () => getArticle(user, indexName, articleId, query),
    enabled: !!user && !!indexName && !!articleId,
  });
}

async function getArticle(user: MiddlecatUser, indexName: AmcatIndexName, articleId: string, query?: AmcatQuery) {
  let q = query || {};
  q = addFilter(q, { _id: { values: [articleId] } });
  const params = { annotations: true };
  const res = await postQuery(user, indexName, q, params);
  const queryResult = amcatQueryResultSchema.parse(res.data);
  return queryResult.results[0];
}
