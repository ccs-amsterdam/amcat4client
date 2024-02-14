import { AmcatArticle, AmcatField, AmcatIndexId, AmcatQuery, AmcatQueryFieldSpec, AmcatUserRole } from "@/interfaces";
import { highlightElasticTags, removeElasticTags } from "./highlightElasticTags";
import { Link as LinkIcon, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MiddlecatUser } from "middlecat-react";
import { useArticles } from "@/api/articles";
import { Loading } from "../ui/loading";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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
    if (!field.client_display.in_list) return;
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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { listFields, layout } = useMemo(() => getListFields(indexRole, fields), [indexRole, fields]);
  const params = useMemo(() => ({ highlight: true, fields: listFields }), [listFields]);
  const { data, isLoading, fetchNextPage } = useArticles(user, indexName, query, params, indexRole);
  const [showGoToTop, setShowGoToTop] = useState(false);

  useEffect(() => {
    // show button if scrolled down at least 500 px
    const onScroll = () => setShowGoToTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [setShowGoToTop]);

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
  }, [data, fetchNextPage, sentinelRef]);

  const articles = data?.results || [];

  if (isLoading) return <Loading msg="Loading articles" />;

  return (
    <div className="relative max-w-2xl rounded ">
      <div className="sticky top-10 flex justify-end pr-5">
        <Button
          className={`${
            showGoToTop ? "opacity-1" : "pointer-events-none opacity-0"
          } absolute  shadow-sm shadow-foreground/50 transition-all duration-300`}
          variant="secondary"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Go to top
        </Button>
      </div>
      <div className="grid max-h-full grid-cols-1 gap-2 overflow-auto">
        {articles.map((row, i: number) => (
          <button
            key={row._id + i}
            className={`prose prose-sm max-w-full animate-fade-in rounded-t border-b border-primary px-3 text-left shadow-foreground/50  
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
        <div ref={sentinelRef} />
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
