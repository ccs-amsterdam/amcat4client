"use client";

import QueryForm from "@/components/QueryForm/QueryForm";
import { AmcatQuery } from "@/interfaces";
import Articles from "@/components/Articles/Articles";
import { MiddlecatUser } from "middlecat-react";

import AggregateResultPanel from "@/components/Aggregate/AggregateResultPanel";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState, parseAsStringEnum } from "next-usequerystate";
import lzstring from "lz-string";
import { deserializeQuery, serializeQuery } from "@/lib/serialieQuery";

interface Props {
  user: MiddlecatUser;
  index: string;
}

enum Tab {
  Summary = "t1",
  Articles = "t2",
  Aggregate = "t3",
  Tags = "t4",
}

export default function Dashboard({ user, index }: Props) {
  const [tab, setTab] = useQueryState("tab", parseAsStringEnum<Tab>(Object.values(Tab)).withDefault(Tab.Summary));
  const [queryState, setQueryState] = useQueryState("query");
  const [query, setQuery] = useState<AmcatQuery>(() => deserializeQuery(queryState));

  useEffect(() => {
    // when query is edited, store it compressed in the URL (if it's not too long)
    setQueryState(serializeQuery(query));
  }, [query]);

  return (
    <div>
      <div className="pb-4">
        <div className="flex flex-col items-center lg:items-start">
          <div className="w-full">
            <QueryForm user={user} index={index} query={query} setQuery={setQuery} />
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-5 w-full">
        <TabsList className="mb-5">
          {Object.keys(Tab).map((tab) => {
            const tabValue = Tab[tab as keyof typeof Tab];
            return (
              <TabsTrigger key={tabValue} value={tabValue}>
                {tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value={Tab.Summary}>
          <Articles user={user} index={index} query={query} />
        </TabsContent>
        <TabsContent value={Tab.Articles}>
          <Articles user={user} index={index} query={query} />
        </TabsContent>
        <TabsContent value={Tab.Aggregate}>
          <AggregateResultPanel user={user} index={index} query={query} />
        </TabsContent>
        <TabsContent value={Tab.Tags}></TabsContent>
      </Tabs>
    </div>
  );
}
