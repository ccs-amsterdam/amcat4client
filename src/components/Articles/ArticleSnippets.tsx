import {
  AmcatArticle,
  AmcatField,
  AmcatIndexId,
  AmcatQuery,
  AmcatQueryFieldSpec,
  AmcatQueryResult,
  AmcatUserRole,
} from "@/interfaces";
import { highlightElasticTags, removeElasticTags } from "./highlightElasticTags";
import { Link as LinkIcon, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MiddlecatUser } from "middlecat-react";
import { useArticles } from "@/api/articles";
import { Loading } from "../ui/loading";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { set } from "date-fns";

interface Props {
  user: MiddlecatUser;
  indexName: AmcatIndexId;
  indexRole: AmcatUserRole;
  query: AmcatQuery;
  fields: AmcatField[];
  onClick?: (doc: AmcatArticle) => void;
}

function getListFields(role: AmcatUserRole, fields: AmcatField[]) {
  const listFields: AmcatQueryFieldSpec[] = [];
  const layout: Record<string, string[]> = {
    text: [],
    meta: [],
  };

  fields.forEach((field) => {
    if (!field.client_settings.inList) return;
    if (role === "NONE") return;
    if (role === "METAREADER" && field.metareader.access === "none") return;

    const listField: AmcatQueryFieldSpec = {
      name: field.name,
    };
    if (field.type === "text") {
      if (field.name !== "title") layout.text.push(field.name);

      const max_snippet = role === "METAREADER" ? field.metareader.max_snippet : undefined;
      listField.snippet = {
        nomatch_chars: max_snippet ? max_snippet.nomatch_chars : 200,
        max_matches: max_snippet ? max_snippet.max_matches : 3,
        match_chars: max_snippet ? max_snippet.match_chars : 50,
      };
    } else {
      layout.meta.push(field.name);
    }
    listFields.push(listField);
  });

  return { listFields, layout };
}

export default function ArticleSnippets({ user, indexName, indexRole, query, fields, onClick }: Props) {
  const { listFields, layout } = useMemo(() => getListFields(indexRole, fields), [indexRole, fields]);
  const params = useMemo(() => ({ highlight: true, fields: listFields }), [listFields]);
  const [pagenr, setPagenr] = useState(0);
  const { data, isLoading, isFetching, fetchNextPage } = useArticles(user, indexName, query, params, indexRole);

  const articles = data?.pages[pagenr]?.results || [];
  const nPages = data?.pages[0]?.meta?.page_count || 0;
  const totalCount = data?.pages[0]?.meta?.total_count || 0;
  const fetchedPages = data?.pages.length || 1;

  useEffect(() => {
    // makes sure pagenr is within bounds and
    setPagenr(fetchedPages - 1);
  }, [fetchedPages]);

  function nextPage() {
    const newPagenr = pagenr + 1;
    if (newPagenr > fetchedPages - 1) fetchNextPage();
    setPagenr(newPagenr);
  }

  if (isLoading) return <Loading msg="Loading articles" />;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{totalCount} articles</h3>
        </div>
        <div className="flex select-none items-center justify-end">
          <Button
            variant="ghost"
            className="hover:bg-transparent"
            onClick={() => setPagenr(pagenr - 1)}
            disabled={pagenr <= 0}
          >
            <SkipBack />
          </Button>
          <div className="grid grid-cols-[1fr,auto,1fr] gap-2">
            <div className="text-center">{pagenr + 1}</div>
            <div>of</div>
            <div>{nPages}</div>
          </div>
          <Button
            variant="ghost"
            className="hover:bg-transparent"
            onClick={nextPage}
            disabled={pagenr > nPages - 2 || isFetching}
          >
            <SkipForward />
          </Button>
        </div>
      </div>
      <div className="relative max-w-2xl rounded ">
        <div
          className={`relative grid max-h-full grid-cols-1 gap-2 overflow-auto pr-3 ${isFetching ? "opacity-80" : ""}`}
        >
          {articles.map((row, i: number) => (
            <button
              key={row._id + i}
              className={`prose prose-sm max-w-full animate-fade-in rounded-t border-b border-primary text-left shadow-foreground/50  
                        transition-all dark:prose-invert hover:translate-x-1    ${onClick ? "cursor-pointer" : ""}`}
            >
              <div onClick={() => onClick && onClick(row)} className={`my-1 min-h-[5rem] py-1  `}>
                <div className="flex justify-between">
                  <h4 className="mt-2">
                    <span title={removeElasticTags(row.title || "")}>{highlightElasticTags(row.title || "")}</span>
                  </h4>
                  {row.url ? (
                    <Link
                      href={row.url}
                      tabIndex={i}
                      rel="noopener noreferrer"
                      target="_blank"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <LinkIcon className=" h-8 w-8 rounded p-1 hover:bg-white" />
                    </Link>
                  ) : null}
                </div>

                <div className="line-clamp-2 overflow-hidden text-ellipsis">{snippetText(row, layout.text)}</div>
                <div className="flex gap-1 pt-2">
                  {listFields
                    .filter((field) => !["_id", "title", "text", "url"].includes(field.name))
                    .map(
                      (field) =>
                        !!row[field.name] && (
                          <Badge key={field.name} className="max-w-[15rem]" tooltip={<span>{field.name}</span>}>
                            {row[field.name]}
                          </Badge>
                        ),
                    )}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className={`h-full ${isFetching ? "block" : "hidden"}`}></div>
      </div>
    </div>
  );
}

function snippetText(row: AmcatArticle, fields: string[]) {
  const text = fields
    .map((f) => row[f])
    .filter((t) => !!t)
    .join(" | ");
  if (text && text.includes("<em>")) return highlightElasticTags(text);
  return text;
}
