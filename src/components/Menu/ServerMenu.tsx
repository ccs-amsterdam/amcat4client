"use client";

import React from "react";

import { useMiddlecat } from "middlecat-react";
import { Database } from "lucide-react";
import { AmcatUserRole } from "@/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useMyGlobalRole } from "@/api/userDetails";
import { cn } from "@/lib/utils";
import MenuRouting from "./MenuRouting";

interface NavbarRoute {
  label: string;
  pathname: string;
  reqRole?: AmcatUserRole;
}

const serverRouting: NavbarRoute[] = [
  { label: "Select index", pathname: "" },
  { label: "Manage users", pathname: "users", reqRole: "ADMIN" },
];

export default function ServerMenu({ className }: { className?: string }) {
  const path = usePathname();
  const { user, loading } = useMiddlecat();
  const role = useMyGlobalRole(user) || "NONE";
  const router = useRouter();
  const server = process.env.NEXT_PUBLIC_AMCAT_SERVER;

  if (loading || !user) return null;

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
        className={cn(
          "flex h-full select-none items-center justify-center gap-3 border-primary text-primary outline-none hover:bg-foreground/10",
          className,
        )}
      >
        <Database />
        <span className="hidden md:inline">Server</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="ml-1 min-w-[200px] border-[1px] border-foreground">
        <MenuRouting routes={serverRouting} current={currentPath()} role={role} onSelect={onSelectPath} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
