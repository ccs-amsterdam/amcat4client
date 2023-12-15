import {
  AmcatDocument,
  AmcatField,
  AmcatQueryResult,
} from "@/amcat/interfaces";
import {
  highlightElasticTags,
  removeElasticTags,
} from "./highlightElasticTags";
import {
  Link as LinkIcon,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
} from "lucide-react";
import Link from "next/link";

interface Props {
  data: AmcatQueryResult | undefined;
  columns: AmcatField[];
  pageChange: (page: number) => void;
  onClick?: (doc: AmcatDocument) => void;
}

export default function ArticleSnippets({
  data,
  columns,
  pageChange,
  onClick,
}: Props) {
  const meta = (row: any) => {
    return columns
      .filter((c) => !["_id", "title", "text", "url"].includes(c.name))
      .map((c) => formatSnippetMeta(row, c))
      .join(" - ");
  };

  const rows: AmcatDocument[] = data?.results || [];
  const page = data?.meta?.page || 0;
  const nPages = data?.meta?.page_count || 0;

  const iconStyle =
    "w-9 h-9 text-secondary cursor-pointer hover:bg-gray-200 p-1 rounded";
  const disabledIconStyle = "w-9 h-9 p-1 rounded opacity-50 cursor-not-allowed";
  return (
    <div className="relative prose">
      <div className="flex justify-center items-center select-none">
        <SkipBack
          className={page > 0 ? iconStyle : disabledIconStyle}
          onClick={() => pageChange(0)}
        />
        <StepBack
          className={page > 0 ? iconStyle : disabledIconStyle}
          onClick={() => pageChange(Math.max(0, page - 1))}
        />

        <h2
          className={`px-4 my-3 text-center min-w-[40%] ${
            nPages === 0 ? "hidden" : ""
          }`}
        >
          Page {page + 1} / {nPages}
        </h2>
        <StepForward
          className={page < nPages - 1 ? iconStyle : disabledIconStyle}
          onClick={() => pageChange(Math.min(nPages - 1, page + 1))}
        />
        <SkipForward
          className={page < nPages - 1 ? iconStyle : disabledIconStyle}
          onClick={() => pageChange(nPages - 1)}
        />
      </div>
      <div className="grid grid-cols-1 overflow-auto border-t-2 border-gray-400">
        {rows.map((row, i: number) => (
          <article key={row._id + i} className="animate-fade-in">
            <div
              onClick={() => onClick && onClick(row)}
              className={`bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded-md m-1 min-h-[5rem] ${
                onClick ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex justify-between">
                <h4 className="mt-2">
                  <span title={removeElasticTags(row.title || "")}>
                    {highlightElasticTags(row.title || "")}
                  </span>
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
                    <LinkIcon className=" w-8 h-8 p-1 hover:bg-white rounded" />
                  </Link>
                ) : null}
              </div>

              <div className="line-clamp-2 overflow-hidden text-ellipsis">
                {snippetText(row)}
              </div>
              <div>{meta(row)}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatSnippetMeta(row: AmcatDocument, column: AmcatField) {
  let val = row[column.name];
  if (val == null) return "";
  if (column.type === "id") return "🔗";
  if (column.type === "date") return val.replace("T", " ").substring(0, 19);
  return val;
}

function snippetText(row: AmcatDocument) {
  const text = row.text as string;
  if (text && text.includes("<em>")) return highlightElasticTags(text);
  return text;
}
