"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import useAmcatIndices from "@/api/indices";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useMiddlecat();
  const { data: indices, isLoading: loadingIndices, error } = useAmcatIndices(user);

  function onSelectIndex(indexName: string) {
    router.push(`/index/${indexName}/dashboard`);
  }

  if (loading || loadingIndices)
    return (
      <div className="mt-[20vh]">
        <Loading />
      </div>
    );

  return (
    <div className="mt-[20vh] flex h-full flex-auto flex-col items-center p-5">
      <div className="prose-xl animate-fade-in  px-4 text-center dark:prose-invert">
        <h2 className="">Select an Index</h2>
        <div className="flex justify-center gap-2 ">
          {indices?.map((index) => {
            return (
              <Button className="min-w-[12rem] text-lg" key={index.name} onClick={() => onSelectIndex(index.name)}>
                {index.name?.replaceAll("_", " ")}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
