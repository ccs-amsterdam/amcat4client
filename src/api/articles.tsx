import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { amcatQueryResultSchema } from "@/schemas";
import { AmcatArticle, AmcatIndexName, AmcatQuery, AmcatQueryResult } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { useEffect } from "react";

export function useArticles(user: MiddlecatUser, index: AmcatIndexName, query?: AmcatQuery) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // this is necessary because react query otherwise refetches ALL pages at once
    return () =>
      queryClient.setQueryData(["articles", user, index, query], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          pageParams: [0],
          pages: [oldData.pages[0]],
        };
      });
  }, [queryClient, user, index, query]);

  return useInfiniteQuery({
    queryKey: ["articles", user, index, query],
    queryFn: ({ pageParam }) => getArticles(user, index, query, pageParam),
    enabled: !!user && !!index,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.page == undefined) return undefined;
      if (lastPage.meta.page >= lastPage.meta.page_count) return undefined;
      return lastPage.meta.page + 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page.results);
    },
  });
}

async function getArticles(user: MiddlecatUser, index: AmcatIndexName, query?: AmcatQuery, page: number = 0) {
  const q = query || {};
  const params = { page, annotations: true, highlight: true };
  const res = await user.api.post(`index/${index}/query`, { ...q, ...params });
  const queryResult: AmcatQueryResult = amcatQueryResultSchema.parse(res.data);
  return queryResult;
}
