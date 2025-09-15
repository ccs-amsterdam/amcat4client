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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AmcatIndex, AmcatIndexId } from "@/interfaces";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";
import { CommandEmpty } from "cmdk";
import { ChevronDown, DatabaseZap, Eye, LayoutDashboard, LibraryIcon, Settings, Shield, User, X } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

export default function IndexMenu() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const indexId = decodeURI(params?.index || "");
  const { data: index } = useIndex(user, indexId);
  const isServerAdmin = useHasGlobalRole(user, "ADMIN");
  if (loading || !user) return null;
  if (!index) return null;

  return (
    <>
      <NavLink index={index} path="dashboard" label="Dashboard" icon={<LayoutDashboard />} />
      <NavLink index={index} path="data" label="Data" icon={<DatabaseZap />} />
      <NavLink index={index} path="settings" label="Settings" icon={<Settings />} />
      <IndexRoleMenu user={user} index={index} />
    </>
  );
}

function useCurrentPath() {
  const path = usePathname();
  if (!path) return "";
  const pathParts = path.split("/");
  return pathParts[pathParts.length - 1] || "";
}

function NavLink({ index, path, label, icon }: { index: AmcatIndex; path: string; label: string; icon: JSX.Element }) {
  const router = useRouter();
  const currentPath = useCurrentPath();
  const { data: serverConfig } = useAmcatConfig();
  const no_auth = serverConfig?.authorization === "no_auth";

  const active = path === currentPath;
  const href = `/indices/${index.id}/${path}`;
  const indexRole = index?.user_role || "NONE";
  const admin = no_auth || indexRole === "ADMIN";
  const writer = admin || indexRole === "WRITER";

  if (!admin) {
    if (path === "users" || path === "settings") return null;
  }
  if (!writer) {
    if (path === "users" || path === "settings" || path === "data") return null;
    if (path === "dashboard" && active) return null;
  }

  return (
    <button
      onClick={() => router.push(href)}
      className={`${
        active ? "text-primary" : "text-foreground/80"
      } flex h-full select-none items-center gap-3 border-primary px-2 outline-none hover:bg-foreground/10 lg:px-4`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

function IndexRoleMenu({ user, index }: { user: MiddlecatUser; index?: AmcatIndex }) {
  const role = index?.user_role || "NONE";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-full select-none items-center gap-3 border-primary px-2 outline-none hover:bg-foreground/10 lg:px-4">
        <Shield />
        Access
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Current index role:</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={index?.user_role}>
          {roles.map((role) => {
            return (
              <DropdownMenuRadioItem key={role} value={role} disabled={index?.user_role !== role}>
                {role}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
        <IndexMenuServerAdmin user={user} index={index} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function IndexMenuServerAdmin({ user, index }: { user: MiddlecatUser; index?: AmcatIndex }) {
  const { mutate: mutateUser } = useMutateIndexUser(user, index?.id);
  const isAdmin = useHasGlobalRole(user, "ADMIN");
  if (!isAdmin) return null;
  function onChangeRole(role: string) {
    if (role === "NONE") {
      mutateUser({ email: user.email, role, action: "delete" });
    } else {
      mutateUser({ email: user.email, role, action: "update" });
    }
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Server admin action</DropdownMenuLabel>
        <DropdownMenuSubTrigger className={!index ? "hidden" : ""}>
          <User className="mr-2 h-4 w-4" />
          <span>Change my index role</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="">
          <DropdownMenuRadioGroup
            value={index?.user_role}
            onSelect={(e) => e.preventDefault()}
            onValueChange={onChangeRole}
          >
            {roles.map((role) => {
              return (
                <DropdownMenuRadioItem
                  key={role}
                  value={role}
                  onSelect={(e) => e.preventDefault()}
                  disabled={!user.authenticated}
                >
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
