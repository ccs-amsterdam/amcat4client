"use client";

import { useIndex } from "@/api/index";
import { useMutateIndexUser } from "@/api/indexUsers";
import { useHasGlobalRole } from "@/api/userDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AmcatIndex } from "@/interfaces";
import { Lock, Shield, User } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { useState } from "react";

const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

export default function IndexRole() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const indexId = decodeURI(params?.index || "");
  const { data: index } = useIndex(user, indexId);
  if (loading || !user) return null;
  if (!index) return null;

  return <IndexRoleMenu user={user} index={index} />;
}

function IndexRoleMenu({ user, index }: { user: MiddlecatUser; index?: AmcatIndex }) {
  const user_role = index?.user_role || "NONE";
  const user_roles = index?.user_roles || [];

  const match = user_roles[user_roles.length - 1]?.match;

  // MAKE THIS A MODAL WITH INFORMATION ABOUT ROLES
  // Make the role the menu bar label
  // add request form
  // add server admin action

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-full select-none items-center gap-3 border-primary px-2 outline-none hover:bg-foreground/10 lg:px-4">
          <Shield />
          <span className="hidden lg:inline">{index?.user_role}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuLabel>{index?.user_role}</DropdownMenuLabel>
            <DropdownMenuLabel className="font-normal">{match}</DropdownMenuLabel>
            <DropdownMenuSubContent>
              <DropdownMenuLabel></DropdownMenuLabel>
              {(index?.user_roles || []).map(({ match, role }) => {
                return (
                  <DropdownMenuItem key={match} className="cursor-default" disabled>
                    {match} : {role}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuLabel></DropdownMenuLabel>
          <IndexMenuServerAdmin user={user} index={index} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

interface ChangeRoleProps {
  user: MiddlecatUser;
  index?: AmcatIndex;
}

function IndexMenuServerAdmin({ user, index }: ChangeRoleProps) {
  const { mutate: mutateUser } = useMutateIndexUser(user, index?.id);
  const isAdmin = useHasGlobalRole(user, "ADMIN");
  if (!isAdmin) return null;

  const exactRole = (index?.user_roles || []).find((r) => r.match === user.email);

  function onChangeRole(role: string | undefined) {
    if (!role) return;
    if (role === "NONE") {
      mutateUser({ email: user.email, role, action: "delete" });
    } else {
      mutateUser({ email: user.email, role, action: "update" });
    }
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Server admin action</DropdownMenuLabel>
        <DropdownMenuSubTrigger className={!index ? "hidden" : ""}>
          <User className="mr-2 h-4 w-4" />
          <span>Change my index role</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="">
          <DropdownMenuRadioGroup
            value={exactRole?.role}
            onSelect={(e) => e.preventDefault()}
            onValueChange={onChangeRole}
          >
            {roles.map((role) => {
              return (
                <DropdownMenuRadioItem
                  key={role}
                  value={role}
                  onSelect={(e) => e.preventDefault()}
                  disabled={!user.authenticated}
                >
                  {role === "NONE" ? "DELETE" : role}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}
