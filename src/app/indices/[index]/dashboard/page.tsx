"use client";
import QueryForm from "@/components/QueryForm/QueryForm";
import { Badge } from "@/components/ui/badge";
import { AmcatField, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";

import { useMyIndexrole } from "@/api";
import { useFields } from "@/api/fields";
import { useFieldValues } from "@/api/fieldValues";
import { useMyGlobalRole } from "@/api/userDetails";
import AggregateResultPanel from "@/components/Aggregate/AggregateResultPanel";
import DownloadArticles from "@/components/Articles/DownloadArticles";
import Summary from "@/components/Summary/Summary";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Reindex from "@/components/Update/Reindex";
import { deserializeQuery, serializeQuery } from "@/lib/serialieQuery";
import { ChevronDown, ChevronUp } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "next-usequerystate";
import { useEffect, useState } from "react";

interface Props {
  params: { index: string };
}

enum Tab {
  Summary = "summary",
  Aggregate = "aggregate",
  Copy = "copy",
  Tags = "update",
  Download = "download",
}

export default function Index({ params }: Props) {
  const indexId = decodeURI(params.index);
  const { user, loading: loadingUser } = useMiddlecat();
  const indexRole = useMyIndexrole(user, indexId);
  const globalRole = useMyGlobalRole(user);
  const [tab, setTab] = useQueryState("tab", parseAsStringEnum<Tab>(Object.values(Tab)).withDefault(Tab.Summary));
  const [queryState, setQueryState] = useQueryState("query");
  const [query, setQuery] = useState<AmcatQuery>(() => deserializeQuery(queryState));

  useEffect(() => {
    // when query is edited, store it compressed in the URL (if it's not too long).
    // This allows sharing URLs with queries for most queries.
    setQueryState(serializeQuery(query));
  }, [query]);

  if (loadingUser || !user) return <Loading />;
  if (indexRole === "NONE")
    return globalRole === "ADMIN" ? (
      <ErrorMsg type="Not Allowed">
        <div className="text-center">
          You do not have access to this index. <br />
          However, as server administrator, you can give yourself access through the <em>index</em> menu
        </div>
      </ErrorMsg>
    ) : (
      <ErrorMsg type="Not Allowed">You do not have access to this index</ErrorMsg>
    );
  const isWriter = indexRole === "WRITER" || indexRole === "ADMIN";
  return (
    <div>
      <div className={` pb-4 `}>
        <div className="flex flex-col items-center lg:items-start">
          <div className="w-full">
            <QueryForm user={user} indexId={indexId} query={query} setQuery={setQuery} />
          </div>
        </div>
      </div>
      <Values indexId={indexId} />
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-5 min-h-[500px] w-full px-1">
        <TabsList className="mb-8 overflow-auto">
          {Object.keys(Tab).map((tab) => {
            if (tab === "Update" && !isWriter) return null;
            const tabValue = Tab[tab as keyof typeof Tab];
            return (
              <TabsTrigger key={tabValue} value={tabValue}>
                {tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="">
          <TabsContent value={Tab.Summary}>
            <Summary user={user} indexId={indexId} query={query} />
          </TabsContent>
          <TabsContent value={Tab.Aggregate}>
            <AggregateResultPanel user={user} indexId={indexId} query={query} />
          </TabsContent>
          <TabsContent value={Tab.Tags}>
            <Values user={user} indexId={indexId} query={query} />
          </TabsContent>
          <TabsContent value={Tab.Copy}>
            <Reindex user={user} indexId={indexId} query={query} />
          </TabsContent>
          <TabsContent value={Tab.Download}>
            <DownloadArticles user={user} indexId={indexId} query={query} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Values({ indexId, user, query }: { indexId: AmcatIndexId; user: MiddlecatUser; query: AmcatQuery }) {
  const { data: fields } = useFields(user, indexId);
  const [expandedFields, setExpandedFields] = useState<AmcatField[]>([]);
  const availableFields = fields == null ? [] : fields.filter((f) => f.type === "tag" || f.type === "keyword");
  useFieldValues;
  if (user == null || fields == null) return null;

  const toggleField = (field: AmcatField) => {
    setExpandedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]));
  };
  console.log(fields);
  return (
    <div className="space-y-2">
      {availableFields.map((field, index) => (
        <div key={index} className="rounded-lg bg-primary/15">
          <div
            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-primary/30"
            onClick={() => toggleField(field)}
          >
            <h3 className="flex items-center text-sm font-medium">
              <DynamicIcon type={field.type} className="h-4" />
              {field.name}
            </h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {expandedFields.includes(field) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          {expandedFields.includes(field) && (
            <div className="px-3 pb-3">
              {field.name && <p className="mb-2 text-xs text-muted-foreground">Description of this {field.type}</p>}
              <div className="flex flex-wrap gap-1">
                <Badge className="cursor-pointer text-xs">Pietje</Badge>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
