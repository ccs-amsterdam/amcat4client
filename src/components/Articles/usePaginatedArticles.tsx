import { useArticles } from "@/api/articles";
import { AmcatField, AmcatIndexId, AmcatQuery, AmcatSnippet, AmcatUserRole } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useListFields from "./useListFields";
import { list } from "postcss";

interface params {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
  fields?: AmcatField[];
  indexRole?: AmcatUserRole;
  pageSize: number;
  highlight?: boolean;
  defaultSnippets?: AmcatSnippet;
}

export default function usePaginatedArticles({
  user,
  indexId,
  query,
  fields,
  indexRole,
  pageSize,
  highlight,
  defaultSnippets,
}: params) {
  const { listFields, layout, fieldSelection, setFieldSelection } = useListFields(
    indexRole || "NONE",
    fields || [],
    defaultSnippets,
  );
  const params = useMemo(
    () => ({ per_page: pageSize, highlight: !!highlight, fields: listFields }),
    [pageSize, listFields],
  );
  const [pagenr, setPagenr] = useState(0);
  const { data, isLoading, isFetching, fetchNextPage } = useArticles(user, indexId, query, params, indexRole);

  const articles = data?.pages[pagenr]?.results || [];
  const nPages = data?.pages[0]?.meta?.page_count || 0;
  const totalCount = data?.pages[0]?.meta?.total_count || 0;
  const fetchedPages = data?.pages.length || 1;

  useEffect(() => {
    // makes sure pagenr is within bounds
    setPagenr((pagenr) => Math.min(fetchedPages - 1, pagenr));
  }, [fetchedPages]);

  const prevPage = useCallback(() => {
    setPagenr((pagenr) => Math.max(0, pagenr - 1));
  }, [setPagenr]);

  const nextPage = useCallback(() => {
    const newPagenr = pagenr + 1;
    if (newPagenr > fetchedPages - 1) fetchNextPage();
    setPagenr(newPagenr);
  }, [pagenr, fetchNextPage, setPagenr]);

  return {
    articles,
    listFields,
    layout,
    isLoading,
    isFetching,
    pagenr,
    nPages,
    totalCount,
    prevPage,
    nextPage,
    fieldSelection,
    setFieldSelection,
  };
}
