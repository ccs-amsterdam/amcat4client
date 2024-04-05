"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

import { ErrorMsg } from "@/components/ui/error-message";

import { useAmcatConfig } from "@/api/config";
import { useCurrentUserDetails } from "@/api/userDetails";
import { useMutateUser, useUsers } from "@/api/users";
import UserRoleTable from "@/components/Users/UserRoleTable";

const roles = ["READER", "WRITER", "ADMIN"];

export default function Index() {
  const { user, loading } = useMiddlecat();
  const { data: config, isLoading: loadingConfig } = useAmcatConfig();
  const { data: userDetails, isLoading: loadingUserDetails } = useCurrentUserDetails(user);
  const { data: users, isLoading: loadingUsers } = useUsers(user);
  const mutate = useMutateUser(user);

  if (loading || loadingUserDetails || loadingUsers || loadingConfig) return <Loading />;

  let ownRole = userDetails?.role;
  if (ownRole == null && config?.authorization === "no_auth") ownRole = "ADMIN";
  async function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutate.mutateAsync({ email, role, action }).catch(console.error);
  }

  if (!user || !ownRole || !users || !config || !changeRole)
    return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex flex-col justify-center gap-12 lg:flex-row">
      <div className="h-min w-min ">
        <h2 className="text-lg font-semibold">Server configuration</h2>

        <p className="text-sm">
          These settings are configured at the server level, and cannot be changed via the client
        </p>
        <div className="mt-4 grid grid-cols-[8rem,1fr]">
          <div className="font-bold">Resource</div>
          <div className="font-mono text-primary">{config.resource}</div>

          <div className="font-bold">MiddleCat</div>
          <div className="font-mono text-primary">{config.middlecat_url}</div>
          <div className="font-bold">Authorization</div>
          <div className="font-mono text-primary">{config.authorization}</div>
        </div>
      </div>
      <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} roles={roles} />
    </div>
  );
}
