"use client";

import { useAmcatConfig } from "@/api/config";
import { useHasGlobalRole } from "@/api/userDetails";
import { CreateIndex } from "@/components/Index/CreateIndex";
import { SelectIndex } from "@/components/Index/SelectIndex";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { useRouter } from "next/navigation";

export default function Index() {
  const { user, loading, signIn } = useMiddlecat();
  const canCreate = useHasGlobalRole(user, "WRITER");
  const router = useRouter();
  const { data: serverConfig, isLoading: configLoading } = useAmcatConfig();
  if (loading || serverConfig == null || user == null) return <Loading />;
  if (
    !user?.authenticated &&
    (serverConfig.authorization === "allow_authenticated_guests" ||
      serverConfig.authorization === "authorized_users_only")
  )
    router.push("/");

  return (
    <div className="prose-xl w-full  max-w-7xl animate-fade-in px-4 dark:prose-invert">
      <div className=" flex h-10 justify-end">{canCreate ? <CreateIndex /> : null}</div>
      <div className="mt-[10vh]">
        <SelectIndex />
      </div>
    </div>
  );
}
