"use client";

import { useIndex } from "@/api/index";
import { useIndexUsers, useMutateIndexUser } from "@/api/indexUsers";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { ErrorMsg } from "@/components/ui/error-message";
import UserRoleTable from "@/components/Users/UserRoleTable";
import CreateUser from "@/components/Users/CreateUser";
import { Button } from "@/components/ui/button";

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const indexId = decodeURI(params.index);
  const { data: index, isLoading: loadingIndex, error } = useIndex(user, indexId);
  const { data: users, isLoading: loadingUsers } = useIndexUsers(user, indexId);
  const mutate = useMutateIndexUser(user, indexId);

  if (loading || loadingIndex || loadingUsers) return <Loading />;

  const ownRole = index?.user_role;
  async function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutate.mutateAsync({ email, role, action }).catch(console.error);
  }

  if (!user || !ownRole || !users || !changeRole) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex justify-center">
      <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} roles={roles} />
    </div>
  );
}
