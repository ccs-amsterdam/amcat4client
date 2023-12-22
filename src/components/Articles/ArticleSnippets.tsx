import { AmcatArticle, AmcatField, AmcatQueryResult } from "@/interfaces";
import { highlightElasticTags, removeElasticTags } from "./highlightElasticTags";
import { Link as LinkIcon, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Separator } from "../ui/separator";

interface Props {
  articles: AmcatArticle[];
  loadMore: () => void;
  fields: AmcatField[];
  onClick?: (doc: AmcatArticle) => void;
}

export default function ArticleSnippets({ articles, loadMore, fields, onClick }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

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
          loadMore();
        }
      },
      { rootMargin: "0px 0px 100% 0px" },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [loadMore, sentinelRef]);


  return (
    <div className="relative max-w-2xl rounded border border-foreground/50">
      <div className="grid max-h-full grid-cols-1 overflow-auto ">
        {articles.map((row, i: number) => (
          <article
            key={row._id + i}
            className={`prose prose-sm max-w-full animate-fade-in  px-3 dark:prose-invert hover:bg-foreground/20  ${
              onClick ? "cursor-pointer" : ""
            }`}
          >
            <div onClick={() => onClick && onClick(row)} className={`m-1 min-h-[5rem] py-1 `}>
              <div className="flex justify-between">
                <h4 className="mt-2">
                  <span title={removeElasticTags(row.title || "")}>{highlightElasticTags(row.title || "")}</span>
                </h4>
                {row.url ? (
                  <Link
                    href={row.url}
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
            <Separator className="" />
          </article>
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
