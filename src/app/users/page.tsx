"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

import { ErrorMsg } from "@/components/ui/error-message";

import UserRoleTable from "@/components/Users/UserRoleTable";
import { useMutateUser, useUsers } from "@/api/users";
import { useCurrentUserDetails } from "@/api/userDetails";
import CreateUser from "@/components/Users/CreateUser";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const roles = ["READER", "WRITER", "ADMIN"];

export default function Index() {
  const { user, loading } = useMiddlecat();
  const { data: userDetails, isLoading: loadingUserDetails } = useCurrentUserDetails(user);
  const { data: users, isLoading: loadingUsers } = useUsers(user);
  const mutate = useMutateUser(user);

  if (loading || loadingUserDetails || loadingUsers) return <Loading />;

  const ownRole = userDetails?.role;
  async function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutate.mutateAsync({ email, role, action }).catch(console.error);
  }

  if (!user || !ownRole || !users || !changeRole) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex flex-col justify-center gap-4">
      <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} roles={roles} />
    </div>
  );
}
