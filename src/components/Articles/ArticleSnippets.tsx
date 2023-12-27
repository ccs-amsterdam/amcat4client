import { AmcatArticle, AmcatField, AmcatIndexName, AmcatQuery } from "@/interfaces";
import { highlightElasticTags, removeElasticTags } from "./highlightElasticTags";
import { Link as LinkIcon, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { MiddlecatUser } from "middlecat-react";
import { useArticles } from "@/api/articles";

interface Props {
  user: MiddlecatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
  fields: AmcatField[];
  onClick?: (doc: AmcatArticle) => void;
}

export default function ArticleSnippets({ user, index, query, fields, onClick }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage } = useArticles(user, index, query, {
    fields: ["title", "date"],
    snippets: ["text"],
  });

  const meta = (row: any) => {
    return fields
      .filter((c) => !["_id", "title", "text", "url"].includes(c.name))
      .map((c) => formatSnippetMeta(row, c))
      .join(" - ");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "0px 0px 100% 0px" },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [fetchNextPage, sentinelRef]);

  const articles = data?.articles || [];

  return (
    <div className="relative max-w-2xl rounded ">
      <div className="grid max-h-full grid-cols-1 gap-2 overflow-auto">
        {articles.map((row, i: number) => (
          <button
            key={row._id + i}
            className={`prose prose-sm max-w-full animate-fade-in rounded border border-primary/50 px-3 text-left shadow-foreground/50  
                        transition-all dark:prose-invert hover:bg-primary/20 hover:shadow-md  ${
                          onClick ? "cursor-pointer" : ""
                        }`}
          >
            <div onClick={() => onClick && onClick(row)} className={`m-1 min-h-[5rem] py-1  `}>
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

              <div className="line-clamp-2 overflow-hidden text-ellipsis">{snippetText(row)}</div>
              <div>{meta(row)}</div>
            </div>
          </button>
        ))}
        <div ref={sentinelRef} />
      </div>
    </div>
  );
}

function formatSnippetMeta(row: AmcatArticle, column: AmcatField) {
  let val = row[column.name];
  if (val == null) return "";
  if (column.type === "id") return "🔗";
  if (column.type === "date") return val.replace("T", " ").substring(0, 19);
  return val;
}

function snippetText(row: AmcatArticle) {
  const text = row.text as string;
  if (text && text.includes("<em>")) return highlightElasticTags(text);
  return text;
}
