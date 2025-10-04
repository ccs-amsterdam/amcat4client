"use client";

import { useAmcatConfig } from "@/api/config";
import { useHasGlobalRole } from "@/api/userDetails";
import { SelectIndex } from "@/components/Index/SelectIndex";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { useRouter } from "next/navigation";

export default function Index() {
  const { user, loading, signIn } = useMiddlecat();
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
    <div className="w-full  max-w-7xl animate-fade-in px-0 dark:prose-invert md:px-4">
      <div className="mt-[4vh]">
        <SelectIndex />
      </div>
    </div>
  );
}
