import ArticleSnippets from "./ArticleSnippets";
import { useCallback, useEffect, useMemo, useState } from "react";
import ArticleModal from "../Article/ArticleModal";
import {
  AmcatUser,
  AmcatField,
  AmcatIndexName,
  AmcatQuery,
  AmcatQueryResult,
  SortSpec,
  AmcatDocument,
} from "@/amcat/interfaces";
import { getField, useFields } from "@/amcat/api/fields";
import { postQuery } from "@/amcat/api/query";
import { useQuery } from "@tanstack/react-query";
import { useMyIndexrole } from "../api/indexDetails";
import { Loading } from "@/components/ui/loading";

export interface ArticlesProps {
  user: AmcatUser;
  index: AmcatIndexName;
  /** Query/filter of which documents to show */
  query: AmcatQuery;
  /** an Array with objects indicating which columns to show and how */
  columns?: AmcatField[];
  /** if true, include all columns AFTER the columns specified in the columns argument */
  allColumns?: boolean;
  /** Number of articles per page */
  perPage?: number;
  /** How to sort results */
  sort?: SortSpec;
  /** Callback when clicking on an article.  */
  onClick?: (doc: AmcatDocument) => void;
  onSortChange?: (sort: SortSpec) => void;
  showOnClick?: boolean;
}

/**
 * Table overview of a subset of articles
 */
export default function Articles({
  user,
  index,
  query,
  columns,
  allColumns = false,
  perPage = 7,
  sort,
  onClick,
  showOnClick = true,
}: ArticlesProps) {
  //TODO: add columns to meta OR retrieve fields (prefer the former) and pass the field types on to the table
  const role = useMyIndexrole(user, index);

  const [articleId, setArticleId] = useState<string | null>(null);
  const { data: fields } = useFields(user, index);
  const [page, setPage] = useState(0);
  const [readyData, setReadyData] = useState<AmcatQueryResult | undefined>(
    undefined
  );

  const { data, isLoading } = useQuery({
    queryKey: ["articles", user, index, query, perPage, sort, page],
    queryFn: () => fetchArticles(user, index, query, perPage, sort, page),
  });

  useEffect(() => {
    if (!isLoading) {
      setReadyData(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    setPage(0);
  }, [user, index, query, perPage, sort]);

  const safeColumns = useMemo(() => {
    if (!columns && fields) return inferColumns(fields);
    return columns;
  }, [columns, fields]);

  const columnList = useMemo(() => {
    if (!safeColumns || !data?.results || data.results.length === 0) return [];

    const dataColumns = Object.keys(data.results[0]);
    // first use the columns as specified in COLUMNS
    const columnList = [...safeColumns];
    // then add all other columns AFTER
    if (allColumns) {
      for (let name of dataColumns) {
        if (columnList.find((c) => c.name === name)) continue;
        const field = getField(fields, name);
        if (field != null) columnList.push(field);
      }
    }
    return columnList;
  }, [data, allColumns, safeColumns, fields]);

  if (!safeColumns || safeColumns.length === 0)
    return <Loading msg="Loading articles" />;

  const handleClick = (row: any) => {
    if (onClick != null) onClick(row);
    if (showOnClick) setArticleId(row._id);
  };

  const canOpen = role && role !== "METAREADER";

  return (
    <div className="w-full">
      <ArticleSnippets
        data={readyData}
        columns={columnList}
        pageChange={setPage}
        onClick={canOpen ? handleClick : undefined}
      />

      {articleId ? (
        <ArticleModal
          key={articleId}
          user={user}
          index={index}
          id={articleId}
          query={query}
          changeArticle={setArticleId}
        />
      ) : null}
    </div>
  );
}

const DEFAULT_COLUMNS = ["date", "title", "url"];

function inferColumns(fields: AmcatField[]) {
  const default_columns: (AmcatField | undefined)[] = DEFAULT_COLUMNS.map((f) =>
    getField(fields, f)
  );
  const nonempty_default_columns: AmcatField[] = default_columns.filter(
    (f) => f
  ) as AmcatField[];

  let extra_columns = fields
    .filter((f) => !DEFAULT_COLUMNS.includes(f.name))
    .filter(
      (f) => f.meta && f.meta.amcat4_display_table === "1"
    ) as AmcatField[];

  extra_columns.sort((a, b) =>
    a.meta && b.meta
      ? parseInt(a.meta.amcat4_display_table) -
        parseInt(b.meta.amcat4_display_table)
      : 0
  );

  return [...nonempty_default_columns, ...extra_columns];
}

async function fetchArticles(
  user: AmcatUser,
  index: AmcatIndexName,
  query: AmcatQuery,
  perPage: number,
  sort: any,
  page: number
) {
  let params = {
    page,
    fields: DEFAULT_COLUMNS,
    per_page: perPage,
    sort,
  };
  const res = await postQuery(user, index, query, params);
  const queryResult: AmcatQueryResult = res.data;
  return queryResult;
}
