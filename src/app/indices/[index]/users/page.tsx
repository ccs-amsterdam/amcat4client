"use client";

import { useAmcatConfig } from "@/api/config";
import { useIndex, useMutateIndex } from "@/api/index";
import { useIndexUsers, useMutateIndexUser } from "@/api/indexUsers";
import UserRoleTable from "@/components/Users/UserRoleTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { AmcatIndex, AmcatUserRole } from "@/interfaces";
import { Edit } from "lucide-react";
import { useMiddlecat } from "middlecat-react";

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const indexId = decodeURI(params.index);
  const { data: index, isLoading: loadingIndex } = useIndex(user, indexId);

  if (loading || loadingIndex) return <Loading />;
  if (!user || !index) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex w-full  flex-col gap-10">
      <Users index={index} />
    </div>
  );
}

function Users({ index }: { index: AmcatIndex }) {
  const { user, loading } = useMiddlecat();
  const { data: users, isLoading: loadingUsers } = useIndexUsers(user, index.id);
  const { mutateAsync } = useMutateIndexUser(user, index.id);
  const { mutate: mutateIndex } = useMutateIndex(user);
  const { data: config } = useAmcatConfig();

  if (loading || loadingUsers) return <Loading />;

  const ownRole = config?.authorization === "no_auth" ? "ADMIN" : index?.user_role;

  async function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutateAsync({ email, role, action }).catch(console.error);
  }

  if (!user || !ownRole || !users || !changeRole) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="grid grid-cols-1 gap-6 p-3 lg:grid-cols-[1fr,19rem]">
      <div className="w-full max-w-4xl">
        <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} roles={roles} />
      </div>
      <div className="ml-auto flex h-max items-center gap-5 ">
        <h3 className="text-xl">Guest role</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex gap-3">
              <div>{index.guest_role}</div>
              <Edit className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-2">
              {["NONE", "METAREADER", "READER", "WRITER"].map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => {
                    mutateIndex({ id: index.id, guest_role: role as AmcatUserRole });
                  }}
                >
                  {role}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
9;
