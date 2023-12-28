"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

import { ErrorMsg } from "@/components/ui/error-message";

import UserRoleTable from "@/components/Users/UserRoleTable";
import { useMutateUser, useUsers } from "@/api/users";
import { useCurrentUserDetails } from "@/api/userDetails";
import CreateUserForm from "@/components/Users/CreateUserForm";
import { useAmcatConfig } from "@/api/config";
import { useMemo } from "react";

const roles = ["READER", "WRITER", "ADMIN"];

export default function Index() {
  const { user, loading } = useMiddlecat();
  const { data: userDetails, isLoading: loadingUserDetails } = useCurrentUserDetails(user);
  const { data: users, isLoading: loadingUsers } = useUsers(user);
  const mutate = useMutateUser(user);

  if (loading || loadingUserDetails || loadingUsers) return <Loading />;

  const ownRole = userDetails?.role;
  function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutate.mutate({ email, role, action });
  }

  if (!user || !ownRole || !users || !changeRole) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex flex-col items-center justify-center">
      <CreateUserForm ownRole={ownRole} roles={roles} />
      <div className="w-full max-w-7xl p-5">
        <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} roles={roles} />
      </div>
    </div>
  );
}
