"use client";

import QueryForm from "@/components/QueryForm/QueryForm";
import { AmcatIndexName, AmcatQuery } from "@/interfaces";
import Articles from "@/components/Articles/Articles";
import { useMiddlecat } from "middlecat-react";

import AggregateResultPanel from "@/components/Aggregate/AggregateResultPanel";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState, parseAsStringEnum } from "next-usequerystate";
import { deserializeQuery, serializeQuery } from "@/lib/serialieQuery";
import Summary from "@/components/Summary/Summary";
import { Loading } from "@/components/ui/loading";
import { amcatIndexNameSchema } from "@/schemas";

interface Props {
  params: { index: string };
}

enum Tab {
  Summary = "t1",
  Articles = "t2",
  Aggregate = "t3",
  Tags = "t4",
}

export default function Index({ params }: Props) {
  const { user, loading: loadingUser } = useMiddlecat();
  const indexName = amcatIndexNameSchema.parse(params.index);
  const [tab, setTab] = useQueryState("tab", parseAsStringEnum<Tab>(Object.values(Tab)).withDefault(Tab.Summary));
  const [queryState, setQueryState] = useQueryState("query");
  const [query, setQuery] = useState<AmcatQuery>(() => deserializeQuery(queryState));

  useEffect(() => {
    // when query is edited, store it compressed in the URL (if it's not too long).
    // This allows sharing URLs with queries for most queries.
    setQueryState(serializeQuery(query));
  }, [query]);

  if (loadingUser || !user) return <Loading />;

  return (
    <div>
      <div className="pb-4">
        <div className="flex flex-col items-center lg:items-start">
          <div className="w-full">
            <QueryForm user={user} indexName={indexName} query={query} setQuery={setQuery} />
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-5 min-h-[500px] w-full px-1">
        <TabsList className="mb-8">
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
            <Summary user={user} indexName={indexName} query={query} />
          </TabsContent>
          <TabsContent value={Tab.Articles}>
            <Articles user={user} indexName={indexName} query={query} />
          </TabsContent>
          <TabsContent value={Tab.Aggregate}>
            <AggregateResultPanel user={user} indexName={indexName} query={query} />
          </TabsContent>
          <TabsContent value={Tab.Tags}></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
