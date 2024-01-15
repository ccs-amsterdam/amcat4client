"use client";

import { useIndex } from "@/api/index";
import { useMutateIndexUser } from "@/api/indexUsers";
import { useMyGlobalRole } from "@/api/userDetails";
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
import { AmcatIndex, MenuRoute } from "@/interfaces";
import { cn } from "@/lib/utils";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";
import { LibraryIcon, Trash, User } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import MenuRouting from "./MenuRouting";
import useAmcatIndices from "@/api/indices";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { CommandEmpty } from "cmdk";
import { Select } from "@radix-ui/react-select";

const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

const indexRouting: MenuRoute[] = [
  { label: "Dashboard", pathname: "dashboard" },
  { label: "Users", pathname: "users", reqRole: "WRITER" },
  { label: "Fields", pathname: "fields", reqRole: "WRITER" },
  { label: "Settings", pathname: "settings", reqRole: "ADMIN" },
];

export default function IndexMenu({ className }: { className?: string }) {
  const path = usePathname();
  const { user, loading } = useMiddlecat();
  const role = useMyGlobalRole(user);
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const indexName = params?.index;
  const { data: index } = useIndex(user, indexName);
  const indexRole = index?.user_role || "NONE";

  function currentPath() {
    if (!indexName || !path) return "";
    const pathParts = path.split("/");
    return pathParts[pathParts.length - 1] || "";
  }
  function onSelectPath(value: string) {
    if (!indexName) return;
    router.push(`/index/${indexName}/${value}`);
  }

  if (loading || !user) return null;

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
          <div className="hidden gap-3 md:flex">{indexName?.replaceAll("_", " ") || "Index"}</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px] border-[1px] border-foreground">
          <SelectIndex user={user} />
          {index && (
            <MenuRouting routes={indexRouting} current={currentPath()} role={indexRole} onSelect={onSelectPath} />
          )}
          {index && isServerAdmin && <IndexMenuServerAdmin user={user} index={index} />}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function IndexMenuServerAdmin({ user, index }: { user: MiddlecatUser; index?: AmcatIndex }) {
  const router = useRouter();
  const role = useMyGlobalRole(user);
  const { mutate } = useMutateIndexUser(user, index?.name);

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
        <DropdownMenuSubTrigger className={!index ? "hidden" : "text-primary"}>
          <User className="mr-2 h-4 w-4" />
          <span>My index role</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="text-primary">
          <DropdownMenuRadioGroup
            value={index?.user_role}
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

function SelectIndex({ user }: { user: MiddlecatUser }) {
  const { data: indices } = useAmcatIndices(user);
  const router = useRouter();

  function onSelectIndex(index: string) {
    router.push(`/index/${index}/dashboard`);
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="text-primary">
          <LibraryIcon className="mr-2 h-4 w-4" />
          <span>Select</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="text-primary">
          <Command>
            <CommandInput placeholder="Filter indices" autoFocus={true} className="h-9" />
            <CommandList>
              <CommandEmpty>No index found</CommandEmpty>
              <CommandGroup>
                {indices?.map((index) => {
                  return (
                    <CommandItem key={index.name} value={index.id} onSelect={(value) => onSelectIndex(value)}>
                      <span className="text-primary">{index.name.replaceAll("_", " ")}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}
