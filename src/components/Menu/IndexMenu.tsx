"use client";

import React, { useEffect, useState } from "react";

import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { LogOut, User, LibraryIcon } from "lucide-react";
import { AmcatIndex, MenuRoute } from "@/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useIndexDetails } from "@/api/indexDetails";
import { useMyGlobalRole } from "@/api/userDetails";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";
import { useMutateIndexUser } from "@/api/indexUsers";
import { cn } from "@/lib/utils";
import MenuRouting from "./MenuRouting";

const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

const indexRouting: MenuRoute[] = [
  { label: "Dashboard", pathname: "dashboard" },
  { label: "Index users", pathname: "users", reqRole: "WRITER" },
  { label: "Fields", pathname: "fields", reqRole: "WRITER" },
];

export default function IndexMenu({ className }: { className?: string }) {
  const path = usePathname();
  const { user, loading } = useMiddlecat();
  const role = useMyGlobalRole(user);
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const index = params?.index;
  const { data: indexDetails } = useIndexDetails(user, index);
  const indexRole = indexDetails?.user_role || "NONE";

  function currentPath() {
    if (!index || !path) return "";
    const pathParts = path.split("/");
    return pathParts[pathParts.length - 1] || "";
  }
  function onSelectPath(value: string) {
    if (!indexDetails) return;
    router.push(`/index/${indexDetails.name}/${value}`);
  }

  if (loading || !user || !index) return null;
  const isServerAdmin = role === "ADMIN";

  return (
    <div className="flex h-full items-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex h-full select-none items-center gap-3 border-primary  text-primary outline-none hover:bg-foreground/10",
            className,
          )}
        >
          <LibraryIcon />
          <div className="hidden gap-3 md:flex">{index?.replaceAll("_", " ") || "Index"}</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px] border-[1px] border-foreground">
          <MenuRouting routes={indexRouting} current={currentPath()} role={indexRole} onSelect={onSelectPath} />

          {index && isServerAdmin && <IndexMenuServerAdmin user={user} indexDetails={indexDetails} />}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function IndexMenuServerAdmin({ user, indexDetails }: { user: MiddlecatUser; indexDetails?: AmcatIndex }) {
  const router = useRouter();
  const role = useMyGlobalRole(user);
  const { mutate } = useMutateIndexUser(user, indexDetails?.name);

  if (role !== "ADMIN") return null;

  function onChangeRole(role: string) {
    if (role === "NONE") {
      mutate({ email: user.email, role, action: "delete" });
    } else {
      mutate({ email: user.email, role, action: "update" });
    }
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuSeparator />

      <DropdownMenuLabel className="text-primary">ADMIN privilege</DropdownMenuLabel>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger className={!indexDetails ? "hidden" : "text-primary"}>
          <User className="mr-2 h-4 w-4" />
          <span>My index role</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="text-primary">
          <DropdownMenuRadioGroup
            value={indexDetails?.user_role}
            onSelect={(e) => e.preventDefault()}
            onValueChange={onChangeRole}
          >
            {roles.map((role) => {
              return (
                <DropdownMenuRadioItem key={role} value={role} onSelect={(e) => e.preventDefault()}>
                  {role}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}
