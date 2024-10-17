"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

import { useHasGlobalRole } from "@/api/userDetails";
import { CreateIndex } from "@/components/Index/CreateIndex";
import { SelectIndex } from "@/components/Index/SelectIndex";
import { useAmcatConfig } from "@/api/config";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { user, loading, signIn } = useMiddlecat();
  const canCreate = useHasGlobalRole(user, "WRITER");
  const { data: serverConfig, isLoading: configLoading } = useAmcatConfig();
  if (loading || serverConfig == null || user == null) return <Loading />;

  return (
    <div className="flex h-full flex-auto flex-col items-center   p-5">
      {user?.authenticated ? null : (
        <div className="rounded border border-primary p-2 ">
          {serverConfig.authorization === "allow_authenticated_guests" ||
          serverConfig.authorization === "authorized_users_only" ? (
            <div>
              The server at <a href={user.resource}>{user.resource.replace("https?://", "")}</a> requires you to log in
              to access it
            </div>
          ) : (
            <div> Note: You are visiting {user.resource} as a guest. Log in </div>
          )}{" "}
          <br />
          <Button onClick={() => signIn()}>Log in</Button>
        </div>
      )}
      <div className="prose-xl w-full  max-w-7xl animate-fade-in px-4 dark:prose-invert">
        <div className=" flex h-10 justify-end">{canCreate ? <CreateIndex /> : null}</div>
        <div className="mt-[10vh]">
          <SelectIndex />
        </div>
      </div>
    </div>
  );
}
