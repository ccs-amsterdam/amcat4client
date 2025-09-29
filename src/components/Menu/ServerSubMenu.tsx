"use client";

import { useAmcatConfig } from "@/api/config";
import { useIndex } from "@/api/index";
import useAmcatIndices from "@/api/indices";
import { useHasGlobalRole } from "@/api/userDetails";
import { AmcatIndex, AmcatIndexId, AmcatUserRole } from "@/interfaces";
import {
  Book,
  ChevronDown,
  Columns3Cog,
  DatabaseZap,
  Ellipsis,
  LayoutDashboard,
  Library,
  LockKeyholeOpen,
  Menu,
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
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CommandInput, Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import { ServerRole } from "./ServerRole";
import { useQueryState } from "next-usequerystate";

type Path = {
  href: string;
  label: string;
  icon: JSX.Element;
  minRole: AmcatUserRole;
};
const paths: Path[] = [
  { href: "admin", label: "Server admin", icon: <Settings className="h-4 w-4" />, minRole: "ADMIN" },
  { href: "?serverRole=open", label: "Server role", icon: <LockKeyholeOpen className="h-4 w-4" />, minRole: "NONE" },
];

export default function ServerSubMenu() {
  const { user, loading } = useMiddlecat();
  const [open, setOpen] = useQueryState("serverRole");
  const params = useParams<{ index: string }>();
  if (loading || !user) return null;

  return (
    <>
      {paths.map((path, i) => (
        <NavLink key={path.href} i={i} path={path} />
      ))}
      <BurgerMenu />
      <ServerRole open={!!open} setOpen={(o) => setOpen(o ? "open" : null)} />
    </>
  );
}

function BurgerMenu({}: {}) {
  const router = useRouter();
  const currentPath = useCurrentPath();

  return (
    <div className="block sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-full select-none items-center gap-1 whitespace-nowrap border-primary px-2 outline-none">
            <Ellipsis className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {paths.map((path) => (
            <DropdownMenuItem
              key={path.href}
              onClick={() => router.push(`/${path.href}`)}
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

function NavLink({ i, path }: { i: number; path: Path }) {
  const router = useRouter();
  const currentPath = useCurrentPath();
  const { user } = useMiddlecat();
  const hasRole = useHasGlobalRole(user, path.minRole);

  if (!hasRole) return null;

  const active = path.href === currentPath;
  const href = `/${path.href}`;

  return (
    <button
      onClick={() => router.push(href)}
      className={`${
        active ? "" : ""
      } rounded  border-background/50 bg-background/20 ${i === 0 ? "rounded-bl" : ""} flex h-full select-none items-center gap-2 border-primary  px-2 outline-none  hover:rounded-b `}
    >
      {path.icon}
      <span className={`hidden sm:inline`}>{path.label}</span>
    </button>
  );
}
