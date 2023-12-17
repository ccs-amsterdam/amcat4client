"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QueryForm from "@/amcat/QueryForm/QueryForm";
import { AggregationOptions, AmcatQuery } from "@/amcat/interfaces";
import { X } from "lucide-react";
import Articles from "@/amcat/Articles/Articles";
import AggregateResult from "@/amcat/Aggregate/AggregateResult";
import { useMiddlecat } from "middlecat-react";
import { Loading } from "@/components/ui/loading";

interface Props {
  index: {
    label: string;
    index: string;
  };
}

const indexAggregations: Record<string, AggregationOptions[]> = {
  tk2023_media: [
    {
      title: "Aantal artikelen per week",
      display: "linechart",
      axes: [
        { field: "date", name: "Datum", interval: "week" },
        { field: "party", name: "Partij" },
      ],
    },
    // {
    //   title: "Aantal artikelen per partij per week",
    //   options: {
    //     display: "barchart",
    //     axes: [{ field: "party", name: "Party" }],
    //   },
    // },
  ],
};

export default function Index({ index }: Props) {
  const router = useRouter();
  const { user, loading: userLoading } = useMiddlecat();
  const [query, setQuery] = useState<AmcatQuery>({});

  const goBack = () => router.push("/dashboard");

  const aggregations = indexAggregations[index.index] || [];

  // useEffect(() => {
  //   if (userLoading) return
  //   if (!user)
  // }, [user, userLoading])

  if (userLoading || !user) return <Loading />;

  return (
    <div>
      <div className="border-b-2 border-gray-400 pb-4">
        <div className="flex flex-col items-center lg:items-start">
          <div className="prose mb-6 flex max-w-[1000px] items-center justify-center gap-3 p-1 lg:justify-start">
            <h1 className="m-0">{index.label}</h1>
            <div className="cursor-pointer p-2" onClick={goBack}>
              <X className="h-8 w-8 p-0 text-secondary" />
            </div>
          </div>
          <div className="w-full">
            <QueryForm user={user} index={index.index} query={query} setQuery={setQuery} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center justify-between gap-10 p-1 xl:flex-row xl:items-start xl:gap-5">
        <div className=" flex-auto xl:min-w-[400px]">
          <Articles user={user} index={index.index} query={query} />
        </div>
        <div className="flex w-full max-w-[800px] flex-auto flex-col">
          {aggregations.map((options) => {
            return (
              <div key={options.title || JSON.stringify(options)} className="flex-auto">
                <AggregateResult user={user} index={index.index} query={query} options={options} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

{
  /* <AggregateResultPanel user={user} index={index.index} query={query} /> */
}
