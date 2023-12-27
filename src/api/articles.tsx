import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { amcatQueryResultSchema } from "@/schemas";
import { AmcatIndexName, AmcatQuery, AmcatQueryParams, AmcatQueryResult } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { useEffect } from "react";
import { postQuery } from "./query";

export function useArticles(user: MiddlecatUser, index: AmcatIndexName, query: AmcatQuery, params?: AmcatQueryParams) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // whenever the query changes (or component mounts) reset the page.
    // this is necessary because react query otherwise refetches ALL pages at once,
    // both slowing down the UI and making needless API requests
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
    queryFn: ({ pageParam }) => getArticles(user, index, query, { page: pageParam, ...(params || {}) }),
    enabled: !!user && !!index && !!query,
    initialPageParam: 0,
    staleTime: 3000,
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.page == undefined || lastPage?.meta?.page_count == undefined) return undefined;
      if (lastPage.meta.page >= lastPage.meta.page_count) return undefined;
      return lastPage.meta.page + 1;
    },
    select: (data) => {
      const meta = data.pages[0].meta;
      const articles = data.pages.flatMap((page) => page.results);
      return { meta, articles };
    },
  });
}

async function getArticles(user: MiddlecatUser, index: AmcatIndexName, query: AmcatQuery, params: AmcatQueryParams) {
  const res = await postQuery(user, index, query, params);
  const queryResult: AmcatQueryResult = amcatQueryResultSchema.parse(res.data);
  return queryResult;
}
