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
} from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

export default function GoToMenu() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const path = usePathname();
  const indexId = decodeURI(params?.index || "");

  const { data: index, isLoading: indexLoading } = useIndex(user, indexId);
  const isServerAdmin = useHasGlobalRole(user, "ADMIN");

  if (loading || !user || (!!indexId && indexLoading)) return null;

  function current() {
    if (path === null || path === "/") return "Server homepage";
    if (path.startsWith("/server") && !indexId) return "Server settings";
    if (path.startsWith("/indices") && !indexId) return "Index overview";
    const indexName = index?.name || "Unknown index";
    return indexName;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={" h-full select-none gap-1 whitespace-nowrap border-primary px-5 outline-none"}>
        {/*<Waypoints className="mr-2" />*/}
        <div className="hidden items-center gap-1 lg:flex">
          <img className="mx-2 px-1" src={"/logo.png"} alt="AmCAT" width={52} height={45} />
          <div className="max-w-[200px] overflow-hidden text-ellipsis">{current()}</div>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className=" block lg:hidden">
          <Menu className="h-6 w-6" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="ml-2 min-w-[200px] border-[1px] border-foreground">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuLabel>Server</DropdownMenuLabel>
            <DropdownMenuItem className="flex" onClick={() => router.push(`/`)}>
              <Home className="mr-2 h-4 w-4" />
              <span className="">Homepage</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!isServerAdmin} className={` flex`} onClick={() => router.push(`/server`)}>
              <Settings className="mr-2 h-4 w-4" />
              <span className="">Settings</span>
            </DropdownMenuItem>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuLabel>Indices</DropdownMenuLabel>
            <DropdownMenuItem className="flex" onClick={() => router.push(`/indices`)}>
              <Library className="mr-2 h-4 w-4" />
              <span className="">Overview</span>
            </DropdownMenuItem>
            <SelectIndex user={user} indexId={indexId} />
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
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
