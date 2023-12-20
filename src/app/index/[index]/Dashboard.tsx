"use client";

import { useRouter } from "next/navigation";
import QueryForm from "@/amcat/QueryForm/QueryForm";
import { AmcatQuery } from "@/amcat/interfaces";
import { X } from "lucide-react";
import Articles from "@/amcat/Articles/Articles";
import { MiddlecatUser } from "middlecat-react";

import AggregateResultPanel from "@/amcat/Aggregate/AggregateResultPanel";
import { useState } from "react";

interface Props {
  user: MiddlecatUser;
  index: string;
}

export default function Dashboard({ user, index }: Props) {
  const [query, setQuery] = useState<AmcatQuery>({});

  return (
    <div>
      <div className="border-b-2 border-gray-400 pb-4">
        <div className="flex flex-col items-center lg:items-start">
          <div className="w-full">
            <QueryForm user={user} index={index} query={query} setQuery={setQuery} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center justify-between gap-10 p-1 xl:flex-row xl:items-start xl:gap-5">
        <div className=" flex-auto xl:min-w-[400px]">
          <Articles user={user} index={index} query={query} />
        </div>
        <div className="flex w-full max-w-[800px] flex-auto flex-col">
          <AggregateResultPanel user={user} index={index} query={query} />
        </div>
      </div>
    </div>
  );
}
