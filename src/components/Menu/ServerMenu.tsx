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
import { Home, Library, LinkIcon, Menu, Paintbrush, Settings, Users } from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ServerInfoDropdownSub } from "./ServerInfo";
import { ServerRole, ServerRoleDropdownItem } from "./ServerRole";
import Link from "next/link";

export default function ServerMenu() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const path = usePathname();
  const indexId = decodeURI(params?.index || "");

  const { data: index, isLoading: indexLoading } = useIndex(user, indexId);
  const { data: branding, isLoading: brandingLoading } = useAmcatBranding();

  const isServerAdmin = useHasGlobalRole(user, "ADMIN");

  const [serverAccessOpen, setServerAccessOpen] = useState(false);

  if (loading || !user || (!!indexId && indexLoading)) return null;

  function current() {
    return branding?.server_name || "Server homepage";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          " h-full select-none gap-1 whitespace-nowrap border-primary outline-none hover:bg-foreground/10 md:px-2"
        }
      >
        <div className=" flex items-center gap-1 md:gap-2">
          {/*<Menu className=" opacity-70 md:h-6 md:w-6" />*/}
          <div className="w-full max-w-[20vw]  overflow-hidden text-ellipsis">{current()}</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="ml-2 min-w-[200px] border-[1px] border-foreground">
        <DropdownMenuGroup>
          {/*<DropdownMenuItem disabled>{serverConfig?.resource}</DropdownMenuItem>*/}
          <DropdownMenuItem className="flex" onClick={() => router.push(`/`)}>
            <Home className="mr-2 h-4 w-4" />
            <span className="">Homepage</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex" onClick={() => router.push(`/indices`)}>
            <Library className="mr-2 h-4 w-4" />
            <span className="">Indices</span>
          </DropdownMenuItem>
          <ServerRoleDropdownItem open={serverAccessOpen} setOpen={setServerAccessOpen} />
          <ServerInfoDropdownSub />
        </DropdownMenuGroup>
        <DropdownMenuGroup className={isServerAdmin ? "" : "hidden"}>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Server Admin</DropdownMenuLabel>
          <DropdownMenuItem className={`flex`} onClick={() => router.push(`/admin?tab=users`)}>
            <Users className="mr-2 h-4 w-4" />
            <span className="">Server users</span>
          </DropdownMenuItem>
          <DropdownMenuItem className={`flex`} onClick={() => router.push(`/admin?tab=branding`)}>
            <Paintbrush className="mr-2 h-4 w-4" />
            <span className="">Branding</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      <ServerRole open={serverAccessOpen} setOpen={setServerAccessOpen} />
    </DropdownMenu>
  );
}
