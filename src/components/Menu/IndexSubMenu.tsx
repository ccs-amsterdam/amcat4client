"use client";

import { useHasIndexRole, useIndex } from "@/api/index";
import useAmcatIndices from "@/api/indices";
import { useHasGlobalRole } from "@/api/userDetails";
import { AmcatIndex, AmcatIndexId, AmcatUserRole } from "@/interfaces";
import {
  Book,
  Columns3Cog,
  DatabaseZap,
  Ellipsis,
  LayoutDashboard,
  LockKeyholeOpen,
  Settings,
  Users,
} from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CommandInput, Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";

type Path = {
  href: string;
  label: string;
  icon: JSX.Element;
  minRole: AmcatUserRole;
};

const paths: Path[] = [
  { href: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, minRole: "METAREADER" },
  { href: "data", label: "Data", icon: <DatabaseZap className="h-4 w-4" />, minRole: "WRITER" },
  { href: "fields", label: "Fields", icon: <Columns3Cog className="h-4 w-4" />, minRole: "WRITER" },
  { href: "settings", label: "Settings", icon: <Settings className="h-4 w-4" />, minRole: "ADMIN" },
  { href: "users", label: "Users", icon: <Users className="h-4 w-4" />, minRole: "ADMIN" },
  { href: "access", label: "Access", icon: <LockKeyholeOpen className="h-4 w-4" />, minRole: "NONE" },
];

export default function IndexSubMenu() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const indexId = decodeURI(params?.index || "");
  const { data: index } = useIndex(user, indexId);
  const isServerAdmin = useHasGlobalRole(user, "ADMIN");
  if (loading || !user) return null;

  if (!index) return null;

  return (
    <>
      {/*<IndexSelector user={user} index={index} />*/}
      {paths.map((path, i) => (
        <NavLink key={path.href} i={i} index={index} path={path} />
      ))}
      <BurgerMenu indexId={indexId} />
    </>
  );
}

function BurgerMenu({ indexId }: { indexId?: AmcatIndexId }) {
  const router = useRouter();
  const currentPath = useCurrentPath();

  return (
    <div className="block sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-full select-none items-center gap-1 whitespace-nowrap border-primary px-2 outline-none hover:bg-foreground/10">
            <Ellipsis className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {paths.map((path) => (
            <DropdownMenuItem
              key={path.href}
              onClick={() => router.push(`/indices/${indexId}/${path.href}`)}
              className={`flex items-center gap-3 ${path.href === currentPath ? "bg-primary text-primary-foreground" : ""}`}
            >
              {path.icon}
              <span>{path.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function useCurrentPath() {
  const path = usePathname();
  if (!path) return "";
  const pathParts = path.split("/");
  return pathParts[pathParts.length - 1] || "";
}

function NavLink({ index, i, path }: { index: AmcatIndex; i: number; path: Path }) {
  const router = useRouter();
  const currentPath = useCurrentPath();
  const { user } = useMiddlecat();
  const hasRole = useHasIndexRole(user, index.id, path.minRole);

  if (!hasRole) return null;

  const active = path.href === currentPath;
  const href = `/indices/${index.id}/${path.href}`;

  return (
    <button
      onClick={() => router.push(href)}
      className={`${
        active
          ? "rounded-b bg-primary text-primary-foreground"
          : "bg-background text-foreground/80 hover:bg-foreground/10"
      } ${i === 0 ? "" : ""} flex h-full select-none items-center gap-2 border-primary px-3 outline-none  hover:rounded-b `}
    >
      {path.icon}
      <span className={`hidden sm:inline`}>{path.label}</span>
    </button>
  );
}

function SelectIndex({ user, index }: { user: MiddlecatUser; index?: AmcatIndex }) {
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
                {indices?.map((ix) => {
                  if (ix.id === index?.id) return null;
                  if (ix.archived) return null;
                  return (
                    <CommandItem key={ix.id} value={ix.id} onSelect={(value) => onSelectIndex(value)}>
                      <span>{ix.name.replaceAll("_", " ")}</span>
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
