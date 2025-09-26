"use client";

import { useAmcatConfig } from "@/api/config";
import { useIndex } from "@/api/index";
import { useMutateIndexUser } from "@/api/indexUsers";
import useAmcatIndices from "@/api/indices";
import { useHasGlobalRole } from "@/api/userDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { AmcatIndex, AmcatIndexId } from "@/interfaces";
import { CommandEmpty } from "cmdk";
import {
  Waypoints,
  ChevronDown,
  DatabaseZap,
  LayoutDashboard,
  LibraryIcon,
  Settings,
  User,
  X,
  Home,
  Library,
  Book,
  Menu,
  LinkIcon,
} from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { ServerInfo, ServerInfoDropdownItem } from "./ServerInfo";
import { useState } from "react";
import { ServerRole, ServerRoleDropdownItem } from "./ServerRole";
import { useAmcatBranding } from "@/api/branding";
import Link from "next/link";

const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

export default function MainMenu() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const path = usePathname();
  const indexId = decodeURI(params?.index || "");

  const { data: index, isLoading: indexLoading } = useIndex(user, indexId);
  const { data: branding, isLoading: brandingLoading } = useAmcatBranding();

  const isServerAdmin = useHasGlobalRole(user, "ADMIN");

  const [serverInfoOpen, setServerInfoOpen] = useState(false);
  const [serverAccessOpen, setServerAccessOpen] = useState(false);

  if (loading || !user || (!!indexId && indexLoading)) return null;

  function current() {
    return branding?.server_name || "Server homepage";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={" h-full select-none gap-1 whitespace-nowrap border-primary px-5 outline-none"}>
        {/*<Waypoints className="mr-2" />*/}
        <div className="hidden items-center gap-1 lg:flex">
          <img className="mx-2 px-1" src={"/logo.png"} alt="AmCAT" width={52} height={45} />
          <div className="max-w-[200px] overflow-hidden text-ellipsis">{current()}</div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
        <div className=" flex items-center gap-3 lg:hidden">
          <Menu />
          <div className="w-full  overflow-hidden text-ellipsis">{current()}</div>
          {/*<img className="" src={"/logo.png"} alt="AmCAT" width={40} height={40} />*/}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="ml-2 min-w-[200px] border-[1px] border-foreground">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="">Server</DropdownMenuLabel>
          {/*<DropdownMenuItem disabled>{serverConfig?.resource}</DropdownMenuItem>*/}
          <DropdownMenuItem className="flex" onClick={() => router.push(`/`)}>
            <Home className="mr-2 h-4 w-4" />
            <span className="">Homepage</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!isServerAdmin}
            className={`flex ${isServerAdmin ? "" : "hidden"}`}
            onClick={() => router.push(`/server`)}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="">Settings</span>
          </DropdownMenuItem>
          <ServerInfoDropdownItem open={serverInfoOpen} setOpen={setServerInfoOpen} />
          <ServerRoleDropdownItem open={serverAccessOpen} setOpen={setServerAccessOpen} />
          <DropdownMenuItem
            className={`${branding?.server_url ? "" : "hidden"} flex`}
            onClick={(e) => e.preventDefault()}
          >
            <Link href={branding?.server_url || "/"} className={`${branding?.server_url ? "" : "hidden"} flex  `}>
              <LinkIcon className="mr-2 h-4 w-4" />
              <span className="max-w-32 overflow-hidden text-ellipsis text-nowrap ">
                {branding?.server_url.replaceAll("https://", "").replaceAll("http://", "")}
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Indices</DropdownMenuLabel>
          <DropdownMenuItem className="flex" onClick={() => router.push(`/indices`)}>
            <Library className="mr-2 h-4 w-4" />
            <span className="">Overview</span>
          </DropdownMenuItem>
          <SelectIndex user={user} indexId={indexId} />
        </DropdownMenuGroup>
      </DropdownMenuContent>

      <ServerInfo open={serverInfoOpen} setOpen={setServerInfoOpen} />
      <ServerRole open={serverAccessOpen} setOpen={setServerAccessOpen} />
    </DropdownMenu>
  );
}

function useCurrentPath() {
  const path = usePathname();
  if (!path) return "";
  const pathParts = path.split("/");
  return pathParts[pathParts.length - 1] || "";
}

function IndicesLink() {
  const router = useRouter();
  const currentPath = useCurrentPath();
  const active = currentPath === "indices";

  return (
    <button
      onClick={() => router.push("/indices")}
      className={`${active ? "text-primary" : "text-header-foreground"}
      flex h-full select-none items-center gap-3 border-primary px-4 outline-none hover:bg-foreground/10`}
    >
      <LibraryIcon />
      <span>Go To</span>
    </button>
  );
}

function SelectIndex({ user, indexId }: { user: MiddlecatUser; indexId: AmcatIndexId }) {
  const { data: indices } = useAmcatIndices(user);
  const router = useRouter();

  function onSelectIndex(index: string) {
    router.push(`/indices/${index}/dashboard`);
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="">
          <Book className="mr-2 h-4 w-4" />
          <span>Quick select</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="">
          <Command>
            <CommandInput placeholder="Filter indices" autoFocus={true} className="h-9" />
            <CommandList>
              <CommandEmpty>No index found</CommandEmpty>
              <CommandGroup>
                {indices?.map((index) => {
                  if (index.id === indexId) return null;
                  if (index.archived) return null;
                  return (
                    <CommandItem key={index.id} value={index.id} onSelect={(value) => onSelectIndex(value)}>
                      <span>{index.name.replaceAll("_", " ")}</span>
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
