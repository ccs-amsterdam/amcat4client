"use client";

import { useIndex } from "@/api/index";
import { useIndexUsers, useMutateIndexUser } from "@/api/indexUsers";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { ErrorMsg } from "@/components/ui/error-message";
import UserRoleTable from "@/components/Users/UserRoleTable";
import CreateUserForm from "@/components/Users/CreateUserForm";

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const { data: index, isLoading: loadingIndex, error } = useIndex(user, params.index);
  const { data: users, isLoading: loadingUsers } = useIndexUsers(user, params.index);
  const mutate = useMutateIndexUser(user, params.index);

  if (loading || loadingIndex || loadingUsers) return <Loading />;

  const ownRole = index?.user_role;
  function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutate.mutate({ email, role, action });
  }

  if (!user || !ownRole || !users || !changeRole) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex justify-center">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-5 p-5 md:grid-cols-[1fr,20rem]">
        <div>
          <h3 className="text-lg font-bold leading-10">Users</h3>
          <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} roles={roles} />
        </div>
        <div>
          <h3 className="text-lg font-bold leading-10">Add user</h3>

          <CreateUserForm ownRole={ownRole} roles={roles} changeRole={changeRole} />
        </div>
      </div>
    </div>
  );
}
