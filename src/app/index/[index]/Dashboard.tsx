"use client";

import { useRouter } from "next/navigation";
import QueryForm from "@/amcat/QueryForm/QueryForm";
import { AmcatQuery } from "@/amcat/interfaces";
import { X } from "lucide-react";
import Articles from "@/amcat/Articles/Articles";
import { MiddlecatUser } from "middlecat-react";

import AggregateResultPanel from "@/amcat/Aggregate/AggregateResultPanel";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  user: MiddlecatUser;
  index: string;
}

export default function Dashboard({ user, index }: Props) {
  const [query, setQuery] = useState<AmcatQuery>({});

  return (
    <div>
      <div className="pb-4">
        <div className="flex flex-col items-center lg:items-start">
          <div className="w-full">
            <QueryForm user={user} index={index} query={query} setQuery={setQuery} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="summary" className="mt-5 w-full">
        <TabsList className="mb-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="aggregate">Aggregate</TabsTrigger>
          <TabsTrigger value="export">Tags</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <Articles user={user} index={index} query={query} />
        </TabsContent>
        <TabsContent value="articles">
          <Articles user={user} index={index} query={query} />
        </TabsContent>
        <TabsContent value="aggregate">
          <AggregateResultPanel user={user} index={index} query={query} />
        </TabsContent>
        <TabsContent value="export"></TabsContent>
      </Tabs>
    </div>
  );
}
