"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import useAmcatIndices from "@/amcat/api/indices";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Index() {
  const router = useRouter();
  const pathName = usePathname();
  const { user, loading } = useMiddlecat();
  const { data: indices, isLoading: loadingIndices, error } = useAmcatIndices(user);

  function onSelectIndex(indexName: string) {
    router.push(`/index/${indexName}`);
  }

  if (loading || loadingIndices)
    return (
      <div className="mt-[20vh]">
        <Loading />
      </div>
    );

  return (
    <div className="mt-[20vh] flex h-full flex-auto flex-col items-center p-5">
      <div className="prose-lg animate-fade-in px-4 text-center dark:prose-invert">
        <h3 className="">Select an Index</h3>
        <div className="not-prose flex gap-2">
          {indices?.map((index) => {
            return (
              <Button className="min-w-[12rem]" key={index.name} onClick={() => onSelectIndex(index.name)}>
                {index.name?.replaceAll("_", " ")}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
