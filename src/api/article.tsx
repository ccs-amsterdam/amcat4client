import { useQuery } from "@tanstack/react-query";
import { amcatQueryResultSchema } from "@/schemas";
import { AmcatIndexName, AmcatQuery } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { addFilter } from "@/api/util";
import { postQuery } from "./query";

export function useArticle(user: MiddlecatUser, index: AmcatIndexName, articleId: string, query?: AmcatQuery) {
  return useQuery({
    queryKey: ["article", user, index, articleId],
    queryFn: () => getArticle(user, index, articleId, query),
    enabled: !!user && !!index && !!articleId,
  });
}

async function getArticle(user: MiddlecatUser, index: AmcatIndexName, articleId: string, query?: AmcatQuery) {
  let q = query || {};
  q = addFilter(q, { _id: { values: [articleId] } });
  const params = { annotations: true };
  const res = await postQuery(user, index, q, params);
  const queryResult = amcatQueryResultSchema.parse(res.data);
  return queryResult.results[0];
}
