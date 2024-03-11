import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { amcatQueryResultSchema } from "@/schemas";
import { AmcatIndexId, AmcatQuery, AmcatQueryParams, AmcatQueryResult } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { useEffect } from "react";
import { postQuery } from "./query";

export function useArticles(
  user: MiddlecatUser,
  indexId: AmcatIndexId,
  query: AmcatQuery,
  params?: AmcatQueryParams,
  indexRole?: string,
  enabled: boolean = true,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // whenever the query changes (or component mounts) reset the page.
    // this is necessary because react query otherwise refetches ALL pages at once,
    // both slowing down the UI and making needless API requests
    return () =>
      queryClient.setQueryData(["articles", user, indexId, query, params, indexRole], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          pageParams: [0],
          pages: [oldData.pages[0]],
        };
      });
  }, [queryClient, user, indexId, query, params, indexRole]);

  return useInfiniteQuery({
    queryKey: ["articles", user, indexId, query, params, indexRole],
    queryFn: ({ pageParam }) => getArticles(user, indexId, query, { page: pageParam, ...(params || {}) }),
    enabled: enabled && !!user && !!indexId && !!query,
    initialPageParam: 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.page == undefined || lastPage?.meta?.page_count == undefined) return undefined;
      if (lastPage.meta.page >= lastPage.meta.page_count) return undefined;
      return lastPage.meta.page + 1;
    },
  });
}

async function getArticles(user: MiddlecatUser, indexId: AmcatIndexId, query: AmcatQuery, params: AmcatQueryParams) {
  // TODO, make sure query doesn't run needlessly
  // also check that it doesn't run if field is added but empty

  const res = await postQuery(user, indexId, query, params);
  const queryResult: AmcatQueryResult = amcatQueryResultSchema.parse(res.data);
  return queryResult;
}
