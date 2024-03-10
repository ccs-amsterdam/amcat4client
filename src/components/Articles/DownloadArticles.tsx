import { useMyIndexrole } from "@/api";
import { useFields } from "@/api/fields";
import { AmcatField, AmcatIndexId, AmcatQuery, AmcatUserRole } from "@/interfaces";
import { ChevronDown, EyeOff } from "lucide-react";
import { MiddlecatUser } from "middlecat-react";
import { MouseEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Loading } from "../ui/loading";
import ArticleTable from "./ArticleTable";
import usePaginatedArticles from "./usePaginatedArticles";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
}

export default function DownloadArticles({ user, indexId, query }: Props) {
  const [fields, setFields] = useState<AmcatField[] | undefined>();
  const [pageSize, setPageSize] = useState(6);

  const indexRole = useMyIndexrole(user, indexId);
  const { data: allFields, isLoading } = useFields(user, indexId);

  useEffect(() => {
    if (!allFields) return;
    setFields(
      allFields.filter((field) => {
        if (!field.client_settings.inList) return false;
        if (indexRole === "METAREADER" && field.metareader.access === "none") return false;
        return true;
      }),
    );
  }, [indexRole, allFields]);

  function toggleField(e: MouseEvent, field: AmcatField) {
    e.preventDefault();
    if (!fields) return;
    if (fields.find((f) => f.name === field.name)) {
      setFields(fields.filter((f) => f !== field));
    } else {
      setFields([...fields, field]);
    }
  }

  if (isLoading) return <Loading />;
  if (!indexRole || !fields) return null;

  return (
    <div>
      <div className="pb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {fields.length} fields <ChevronDown className="h-5 w-5" />{" "}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onClick={(e) => e.preventDefault()} className="max-h-60 overflow-auto">
            {allFields?.map((field) => {
              const selected = fields.find((f) => f.name === field.name);
              const forbidden = indexRole === "METAREADER" && field.metareader.access === "none";
              const snippet = indexRole === "METAREADER" && field.metareader.access === "snippet";
              return (
                <DropdownMenuItem
                  disabled={forbidden}
                  onClick={(e) => toggleField(e, field)}
                  key={field.name}
                  className="flex gap-2"
                >
                  {selected ? <Checkbox checked={true} /> : <Checkbox checked={false} />}
                  {field.name}
                  <span className="text-destructive">{forbidden ? <EyeOff className="h-4 w-4" /> : ""}</span>
                  <span className="text-foreground/50">{snippet ? "(snippet)" : ""}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Downloader user={user} indexId={indexId} query={query} fields={fields} indexRole={indexRole} />
      <h3 className="mb-2 text-xl font-bold text-primary">Preview</h3>
      <ArticleTable user={user} indexId={indexId} query={query} fields={fields} />
    </div>
  );
}

interface DownloaderProps {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
  fields: AmcatField[];
  indexRole: AmcatUserRole;
}

function Downloader({ user, indexId, query, fields, indexRole }: DownloaderProps) {
  const { articles, layout, listFields, isFetching, pageIndex, pageCount, totalCount, prevPage, nextPage } =
    usePaginatedArticles({
      user,
      indexId,
      query,
      fields,
      indexRole,
      pageSize: 1000,
    });

  return <div></div>;
}
