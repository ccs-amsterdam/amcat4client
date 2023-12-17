import { useQuery } from "@tanstack/react-query";
import { amcatQueryResultSchema } from "@/amcat/schemas";
import { AmcatIndexName, AmcatQuery } from "@/amcat/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { addFilter } from "@/amcat/api/util";

export function useArticle(user: MiddlecatUser, index: AmcatIndexName, articleId: string, query?: AmcatQuery) {
  return useQuery({
    queryKey: ["config", user, index, articleId],
    queryFn: () => getArticle(user, index, articleId, query),
    enabled: !!user && !!index && !!articleId,
  });
}

async function getArticle(user: MiddlecatUser, index: AmcatIndexName, articleId: string, query?: AmcatQuery) {
  const q = query || {};
  const articleQuery = addFilter(q, { _id: { values: [articleId] } });
  const params = { annotations: true };
  const res = await user.api.post(`index/${index}/query`, { ...articleQuery, ...params });
  const queryResult = amcatQueryResultSchema.parse(res.data);
  return queryResult.results[0];
}
