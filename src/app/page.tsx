"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

import { useHasGlobalRole } from "@/api/userDetails";
import { CreateIndex } from "@/components/Index/CreateIndex";
import { SelectIndex } from "@/components/Index/SelectIndex";

export default function Index() {
  const { user, loading } = useMiddlecat();
  const canCreate = useHasGlobalRole(user, "WRITER");

  if (loading) return <Loading />;

  return (
    <div className="flex h-full flex-auto flex-col items-center   p-5">
      <div className="prose-xl w-full  max-w-7xl animate-fade-in px-4 dark:prose-invert">
        <div className=" flex h-10 justify-end">{canCreate ? <CreateIndex /> : null}</div>
        <div className="mt-[10vh]">
          <SelectIndex />
        </div>
      </div>
    </div>
  );
}
