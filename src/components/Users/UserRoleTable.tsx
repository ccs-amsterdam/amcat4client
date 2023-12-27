"use client";

import { DataTable } from "@/components/ui/datatable";
import { AmcatUserDetails, AmcatUserRole } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { ColumnDef } from "@tanstack/react-table";
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

interface Props {
  user: MiddlecatUser;
  ownRole: AmcatUserRole;
  users: AmcatUserDetails[];
  changeRole: (email: string, role: string) => void;
}

// This components works for both Server and Index users, depending
// on the props passed in.

export default function UserRoleTable({ user, ownRole, users, changeRole }: Props) {
  const [changeOwnRole, setChangeOwnRole] = useState<string | undefined>(undefined);

  if (!["ADMIN", "WRITER"].includes(ownRole))
    return <ErrorMsg type="Not Allowed">Need to have the WRITER or ADMIN role to edit index users</ErrorMsg>;

  function onChangeRole(email: string, currentRole: AmcatUserRole, newRole: string) {
    const role = amcatUserRoleSchema.parse(newRole);
    if (currentRole === role) return;
    if (email === user?.email && roleHigherThan(currentRole, role)) {
      // if the user is changing their own role to a lower role, we need to ask for confirmation
      setChangeOwnRole(newRole);
      return;
    }
    changeRole(email, newRole);
  }
  function confirmChangeOwnRole() {
    if (!user || !changeOwnRole) return;
    changeRole(user.email, changeOwnRole);
  }

  const data: Row[] =
    users?.map((user) => {
      const row: Row = { ...user, canCreateAdmin: ownRole === "ADMIN" };
      const canEditUser = ownRole === "ADMIN" || (ownRole === "WRITER" && user.role === "WRITER");
      if (canEditUser) row.onChange = (newRole: string) => onChangeRole(user.email, user.role, newRole);
      return row;
    }) || [];

  return (
    <>
      <DataTable columns={tableColumns} data={data} />
      <AlertDialog open={changeOwnRole !== undefined} onOpenChange={() => setChangeOwnRole(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>Are you sure you want to limit your own role?</AlertDialogHeader>
          <AlertDialogDescription>
            You are about to change your own role from {ownRole} to {changeOwnRole}. This will limit your own access to
            this index, and you will not be able to change this back yourself.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Oh god no!</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChangeOwnRole}>Do it!!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface Row {
  email: string;
  role: string;
  canCreateAdmin: boolean;
  onChange?: (newRole: string) => void;
}

const tableColumns: ColumnDef<Row>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const { role, canCreateAdmin, onChange } = row.original;
      if (!onChange) return role;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-full items-center gap-3 border-primary text-primary outline-none">
            {role}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={row.original.role} onValueChange={onChange}>
              {amcatUserRoles.map((role) => {
                if (!canCreateAdmin && role === "ADMIN") return null;
                return (
                  <DropdownMenuRadioItem key={role} value={role}>
                    {role}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
