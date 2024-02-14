"use client";

import React from "react";

import { useMiddlecat } from "middlecat-react";
import { Database } from "lucide-react";
import { AmcatUserRole } from "@/interfaces";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useMyGlobalRole } from "@/api/userDetails";
import { cn } from "@/lib/utils";
import MenuRouting from "./MenuRouting";

interface NavbarRoute {
  label: string;
  pathname: string;
  reqRole?: AmcatUserRole;
}

const serverRouting: NavbarRoute[] = [{ label: "Manage users", pathname: "users", reqRole: "ADMIN" }];

export default function ServerMenu() {
  const path = usePathname();
  const { user, loading, fixedResource: server } = useMiddlecat();
  const role = useMyGlobalRole(user) || "NONE";
  const router = useRouter();

  if (loading || !user) return null;
  if (role !== "ADMIN") return null;

  function currentPath() {
    if (!path) return "";
    return path.split("/")[1] || "";
  }
  function onSelectPath(value: string) {
    router.push(`/${value}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          "flex h-full select-none items-center justify-center gap-3 border-primary px-4 text-primary outline-none hover:bg-foreground/10"
        }
      >
        <Database />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="ml-1 min-w-[200px] border-[1px] border-foreground">
        <MenuRouting routes={serverRouting} current={currentPath()} role={role} onSelect={onSelectPath} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
