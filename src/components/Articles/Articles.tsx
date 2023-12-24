import ArticleSnippets from "./ArticleSnippets";
import { useEffect, useMemo, useState } from "react";
import ArticleModal from "@/components/Article/ArticleModal";
import { AmcatField, AmcatIndexName, AmcatQuery, AmcatQueryResult, SortSpec, AmcatArticle } from "@/interfaces";
import { getField, useFields } from "@/api/fields";
import { postQuery } from "@/api/query";
import { useQuery } from "@tanstack/react-query";
import { useMyIndexrole } from "@/api/indexDetails";
import { Loading } from "@/components/ui/loading";
import { MiddlecatUser } from "middlecat-react";
import { useArticles } from "@/api/articles";

export interface ArticlesProps {
  user: MiddlecatUser;
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
  onClick?: (doc: AmcatArticle) => void;
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

  const articleQuery = useArticles(user, index, query);

  if (!fields) return <Loading msg="Loading fields" />;

  const handleClick = (row: any) => {
    if (onClick != null) onClick(row);
    if (showOnClick) setArticleId(row._id);
  };

  const canOpen = role && role !== "METAREADER";

  return (
    <div className="w-full">
      <div className="grid grid-cols-[max,1fr] ">
        <ArticleSnippets
          articles={articleQuery?.data?.articles || []}
          meta={articleQuery?.data?.meta}
          loadMore={articleQuery.fetchNextPage}
          fields={fields}
          onClick={canOpen ? handleClick : undefined}
        />
        <div> </div>
      </div>

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
