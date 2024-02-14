"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import useAmcatIndices from "@/api/indices";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SelectIndex() {
  const router = useRouter();
  const { user, loading } = useMiddlecat();
  const { data: indices, isLoading: loadingIndices } = useAmcatIndices(user);

  function onSelectIndex(indexId: string) {
    router.push(`/index/${indexId}/dashboard`);
  }

  if (loading || loadingIndices)
    return (
      <div className="mt-[20vh]">
        <Loading />
      </div>
    );

  return (
    <div>
      <h2 className="">{indices?.length ? "Select an Index" : "This server does not have any indices you can view"}</h2>
      <div className="flex gap-2 ">
        {indices?.map((index) => {
          return (
            <Button
              className="flex h-full min-w-[12rem] flex-col items-start text-left text-lg"
              key={index.name}
              onClick={() => onSelectIndex(index.id)}
            >
              <div className="font-semibold">{index.name}</div>
              <div className="font-mono text-sm">{index.id}</div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
