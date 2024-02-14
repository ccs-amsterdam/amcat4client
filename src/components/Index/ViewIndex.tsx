"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import useAmcatIndices from "@/api/indices";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useHasGlobalRole } from "@/api/userDetails";
import { CreateIndex } from "@/components/Index/CreateIndex";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useMiddlecat();
  const canCreate = useHasGlobalRole(user, "WRITER");
  const { data: indices, isLoading: loadingIndices, error } = useAmcatIndices(user);

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
    <div className="mt-[10vh] flex h-full flex-auto flex-col items-center p-5">
      <div className="prose-xl animate-fade-in  px-4 text-center dark:prose-invert">
        <div className="h-20">{canCreate ? <CreateIndex /> : null}</div>
        <h2 className="">
          {indices?.length ? "Select an Index" : "This server does not have any indices you can view"}
        </h2>
        <div className="flex justify-center gap-2 ">
          {indices?.map((index) => {
            return (
              <Button className="min-w-[12rem] text-lg" key={index.name} onClick={() => onSelectIndex(index.id)}>
                {index.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
