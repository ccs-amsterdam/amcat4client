import { MiddlecatUser } from "middlecat-react";
import { AmcatArticle, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { useMyIndexrole } from "@/api";
import { useFields } from "@/api/fields";
import useListFields from "./useListFields";
import { useMemo, useState } from "react";
import { useArticles } from "@/api/articles";
import usePaginatedArticles from "./usePaginatedArticles";
import { DataTable } from "../ui/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { formatField } from "@/lib/formatField";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
}

const defaultSnippets = {
  nomatch_chars: 200,
  max_matches: 0,
  match_chars: 1,
};

export default function ArticleTable({ user, indexId, query }: Props) {
  const [pageSize, setPageSize] = useState(6);

  const indexRole = useMyIndexrole(user, indexId);
  const { data: fields } = useFields(user, indexId);
  const { articles, layout, fieldSelection, listFields, isFetching, pagenr, nPages, totalCount, prevPage, nextPage } =
    usePaginatedArticles({ user, indexId, query, fields, indexRole, pageSize, defaultSnippets });

  const columns: ColumnDef<AmcatArticle>[] = useMemo(() => {
    if (!fieldSelection) return [];
    return fieldSelection.map((field) => ({
      header: field.name,
      cell: ({ row }) => {
        return (
          <div className="max-w-xl overflow-hidden text-ellipsis whitespace-nowrap">
            {formatField(row.original, field)}
          </div>
        );
      },
    }));
  }, [fieldSelection]);

  return (
    <div>
      <DataTable data={articles} columns={columns} pageIndex={pagenr} />
    </div>
  );
}
