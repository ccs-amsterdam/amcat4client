"use client";

import { useIndexDetails } from "@/api/indexDetails";
import { useIndexUsers, useMutateIndexUser } from "@/api/indexUsers";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

import { ErrorMsg } from "@/components/ui/error-message";

import UserRoleTable from "@/components/Users/UserRoleTable";

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const { data: indexDetails, isLoading: loadingIndexDetails, error } = useIndexDetails(user, params.index);
  const { data: users, isLoading: loadingUsers } = useIndexUsers(user, params.index);
  const mutate = useMutateIndexUser(user, params.index);

  if (loading || loadingIndexDetails || loadingUsers) return <Loading />;

  const ownRole = indexDetails?.user_role;
  function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutate.mutate({ email, role, action });
  }

  if (!user || !ownRole || !users || !changeRole) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl p-5">
        <UserRoleTable
          user={user}
          ownRole={ownRole}
          users={users}
          changeRole={changeRole}
          roles={["METAREADER", "READER", "WRITER", "ADMIN"]}
        />
      </div>
    </div>
  );
}
