"use client";

import { useAmcatConfig } from "@/api/config";
import { SelectIndex } from "@/components/Index/SelectIndex";
import { Loading } from "@/components/ui/loading";
import { useAmcatSession } from "@/components/Auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function Index() {
  const { user, loading } = useAmcatSession();
  const { data: serverConfig } = useAmcatConfig();
  if (loading || serverConfig == null || user == null) return <Loading />;
  // if (
  //   !user?.authenticated &&
  //   (serverConfig.authorization === "allow_authenticated_guests" ||
  //     serverConfig.authorization === "authorized_users_only")
  // )
  //   router.push("/");

  return (
    <div className="h-full w-full max-w-7xl animate-fade-in px-0 dark:prose-invert md:px-4">
      <div className="mt-[4vh]">
        <SelectIndex />
      </div>
    </div>
  );
}
