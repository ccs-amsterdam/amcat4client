"use client";

import { useAmcatBranding } from "@/api/branding";
import { useIndex } from "@/api/index";
import { useHasGlobalRole } from "@/api/userDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, Library, LinkIcon, LockKeyholeOpen, Menu, Paintbrush, Server, Settings, Users } from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ServerInfoDropdownSub } from "./ServerInfo";
import Link from "next/link";
import { SubMenuPath, useSubMenuPaths } from "./SubMenu.tsx";

export default function ServerMenu({ serverPaths }: { serverPaths: SubMenuPath[] }) {
  const { user, loading } = useMiddlecat();
  const router = useRouter();

  const allowedServerPaths = useSubMenuPaths(serverPaths);

  if (loading || !user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          "block h-full select-none gap-1 whitespace-nowrap border-primary pl-1 pr-3 outline-none hover:bg-foreground/10   md:px-2"
        }
      >
        <Menu className=" opacity-70 md:h-6 md:w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="ml-2 min-w-[200px] border-[1px] border-foreground">
        {/*<DropdownMenuGroup>*/}
        {/*<DropdownMenuLabel></DropdownMenuLabel>*/}

        <DropdownMenuItem className="flex" onClick={() => router.push(`/`)}>
          <Home className="mr-2 h-4 w-4" />
          <span className="">Home</span>
        </DropdownMenuItem>

        {allowedServerPaths.map((path) => (
          <DropdownMenuItem key={path.href} className={`flex`} onClick={() => router.push(path.href)}>
            <path.Icon className="mr-2 h-4 w-4" />
            <span className="">{path.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
