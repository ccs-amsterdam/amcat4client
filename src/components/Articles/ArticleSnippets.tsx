import {
  AmcatArticle,
  AmcatField,
  AmcatIndexId,
  AmcatQuery,
  AmcatQueryFieldSpec,
  AmcatQueryResult,
  AmcatUserRole,
} from "@/interfaces";
import { highlightElasticTags, removeElasticTags } from "../../lib/highlightElasticTags";
import { Link as LinkIcon, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MiddlecatUser } from "middlecat-react";
import { useArticles } from "@/api/articles";
import { Loading } from "../ui/loading";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { set } from "date-fns";
import useListFields from "./useListFields";
import usePaginatedArticles from "./usePaginatedArticles";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  indexRole: AmcatUserRole;
  query: AmcatQuery;
  fields: AmcatField[];
  onClick?: (doc: AmcatArticle) => void;
}

const defaultSnippets = {
  nomatch_chars: 200,
  max_matches: 5,
  match_chars: 50,
};

export default function ArticleSnippets({ user, indexId, indexRole, query, fields, onClick }: Props) {
  const { articles, layout, listFields, isFetching, pageIndex, pageCount, totalCount, prevPage, nextPage } =
    usePaginatedArticles({ user, indexId, query, fields, indexRole, highlight: true, defaultSnippets, pageSize: 6 });
  // if (isLoading) return <Loading msg="Loading articles" />;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{totalCount} articles</h3>
        </div>
        <div className={`flex select-none items-center justify-end ${pageCount > 1 ? "" : "hidden"}`}>
          <Button variant="ghost" className="hover:bg-transparent" onClick={() => prevPage()} disabled={pageIndex <= 0}>
            <SkipBack />
          </Button>
          <div className="grid grid-cols-[1fr,auto,1fr] gap-2">
            <div className="text-center">{pageIndex + 1}</div>
            <div>of</div>
            <div>{pageCount}</div>
          </div>
          <Button
            variant="ghost"
            className="hover:bg-transparent"
            onClick={nextPage}
            disabled={pageIndex > pageCount - 2 || isFetching}
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
                          <Badge
                            key={field.name}
                            className="max-w-[15rem]"
                            tooltip={<span>{field.name}</span>}
                            variant={String(row[field.name]).includes("<em>") ? "secondary" : "default"}
                          >
                            {removeElasticTags(row[field.name])}
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
