"use client";

import { useIndexDetails } from "@/api/indexDetails";
import { useIndexUsers, useMutateIndexUser } from "@/api/indexUsers";
import { DataTable } from "@/components/ui/datatable";
import { Loading } from "@/components/ui/loading";
import { AmcatUserDetails, AmcatUserRole } from "@/interfaces";
import { useMiddlecat } from "middlecat-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { amcatUserRoleSchema, amcatUserRoles } from "@/schemas";
import { ChevronDown, Edit } from "lucide-react";
import { ErrorMsg } from "@/components/ui/error-message";
import { roleHigherThan } from "@/api/util";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
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
  function changeRole(email: string, role: string) {
    mutate.mutate({ email, role });
  }

  if (!user || !ownRole || !users || !changeRole) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl p-5">
        <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} />
      </div>
    </div>
  );
}
