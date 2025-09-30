"use client";

import { useMyIndexrole } from "@/api/index";
import { useMyGlobalRole } from "@/api/userDetails";
import { AmcatUserRole } from "@/interfaces";
import { Ellipsis } from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useMemo } from "react";
import { hasMinAmcatRole } from "@/lib/utils";

export type SubMenuPath = {
  href: string;
  label: string;
  Icon: React.ElementType;
  minIndexRole?: AmcatUserRole;
  minServerRole?: AmcatUserRole;
};

export function useSubMenuPaths(paths: SubMenuPath[]) {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const indexId = decodeURI(params?.index || "");
  const globalRole = useMyGlobalRole(user);
  const indexRole = useMyIndexrole(user, indexId);

  const allowedPaths = useMemo(() => {
    return paths.filter((path) => {
      if (path.minServerRole && !hasMinAmcatRole(globalRole, path.minServerRole)) return false;
      if (path.minIndexRole && !hasMinAmcatRole(indexRole, path.minIndexRole)) return false;
      console.log(path);
      return true;
    });
  }, [paths, globalRole, indexRole]);

  return allowedPaths;
}

export function SubMenu({ basePath = "", paths }: { basePath?: string; paths: SubMenuPath[] }) {
  const allowedPaths = useSubMenuPaths(paths);

  return (
    <div className="grid grid-cols-[1fr,max-content]">
      <div className="flex h-9 w-full items-center justify-start   overflow-hidden text-sm">
        {allowedPaths.map((path, i) => (
          <NavLink key={path.href} i={i} basePath={basePath} path={path} />
        ))}
      </div>
      <BurgerMenu basePath={basePath} paths={allowedPaths} />
    </div>
  );
}

function BurgerMenu({ basePath, paths }: { basePath: string; paths: SubMenuPath[] }) {
  const router = useRouter();
  const currentPath = useCurrentPath();

  return (
    <div className="block sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-full select-none items-center gap-1 whitespace-nowrap border-primary px-3 outline-none hover:bg-foreground/10">
            <Ellipsis className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {paths.map((path) => (
            <DropdownMenuItem
              key={path.href}
              onClick={() => router.push(`${basePath}/${path.href}`)}
              className={`flex items-center gap-3 ${path.href === currentPath ? "bg-primary text-primary-foreground" : ""}`}
            >
              {<path.Icon className="h-4 w-4" />}
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

function NavLink({ i, basePath, path }: { i: number; basePath: string; path: SubMenuPath }) {
  const router = useRouter();
  const currentPath = useCurrentPath();

  const active = path.href === currentPath;
  const href = `${basePath}/${path.href}`;

  return (
    <button
      onClick={() => router.push(href)}
      className={`${
        active ? "border-b-2 border-primary  font-semibold" : "bg-background text-foreground/80 hover:bg-foreground/10"
      } ${i === 0 ? "" : ""} flex h-full select-none items-center gap-2 border-primary px-3 outline-none   `}
    >
      {<path.Icon className="h-4 w-4" />}
      <span className={`hidden sm:inline`}>{path.label}</span>
    </button>
  );
}
