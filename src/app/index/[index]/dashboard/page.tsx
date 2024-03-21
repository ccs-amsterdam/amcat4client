"use client";

import QueryForm from "@/components/QueryForm/QueryForm";
import { AmcatQuery } from "@/interfaces";
import Articles from "@/components/Articles/Articles";
import { useMiddlecat } from "middlecat-react";

import AggregateResultPanel from "@/components/Aggregate/AggregateResultPanel";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState, parseAsStringEnum } from "next-usequerystate";
import { deserializeQuery, serializeQuery } from "@/lib/serialieQuery";
import Summary from "@/components/Summary/Summary";
import { Loading } from "@/components/ui/loading";
import { ErrorMsg } from "@/components/ui/error-message";
import { useMyIndexrole } from "@/api";
import ArticleTable from "@/components/Articles/ArticleTable";
import DownloadArticles from "@/components/Articles/DownloadArticles";
import Upload from "@/components/Upload/Upload";

interface Props {
  params: { index: string };
}

enum Tab {
  Summary = "t1",
  Aggregate = "t2",
  Tags = "t3",
  Download = "t4",
}

export default function Index({ params }: Props) {
  const indexId = decodeURI(params.index);
  const { user, loading: loadingUser } = useMiddlecat();
  const indexRole = useMyIndexrole(user, indexId);
  const [tab, setTab] = useQueryState("tab", parseAsStringEnum<Tab>(Object.values(Tab)).withDefault(Tab.Summary));
  const [queryState, setQueryState] = useQueryState("query");
  const [query, setQuery] = useState<AmcatQuery>(() => deserializeQuery(queryState));

  useEffect(() => {
    // when query is edited, store it compressed in the URL (if it's not too long).
    // This allows sharing URLs with queries for most queries.
    setQueryState(serializeQuery(query));
  }, [query]);

  if (loadingUser || !user) return <Loading />;
  if (indexRole === "NONE") return <ErrorMsg type="Not Allowed">You do not have access to this index</ErrorMsg>;

  return (
    <div>
      <div className={` pb-4 `}>
        <div className="flex flex-col items-center lg:items-start">
          <div className="w-full">
            <QueryForm user={user} indexId={indexId} query={query} setQuery={setQuery} />
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-5 min-h-[500px] w-full px-1">
        <TabsList className="mb-8 overflow-auto">
          {Object.keys(Tab).map((tab) => {
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
          <TabsContent value={Tab.Tags}></TabsContent>
          <TabsContent value={Tab.Download}>
            <DownloadArticles user={user} indexId={indexId} query={query} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
