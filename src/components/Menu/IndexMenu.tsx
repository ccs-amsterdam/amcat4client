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
import { ChevronDown, DatabaseZap, LayoutDashboard, LibraryIcon, Settings, User, X } from "lucide-react";
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
  if (!index) return <IndicesLink />;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={
            "flex h-full select-none items-center whitespace-nowrap border-primary bg-primary px-5 text-primary-foreground outline-none"
          }
        >
          <LibraryIcon className="mr-2" />

          <div className="hidden max-w-[45vw] overflow-hidden text-ellipsis lg:block">{index.name}</div>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="ml-2 min-w-[200px] border-[1px] border-foreground">
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuItem
                className="flex"
                onClick={() => router.push(`/indices${!index.folder ? "" : "?folder=" + index.folder}`)}
              >
                <X className="mr-2 h-4 w-4" />
                <span className="">Close index</span>
              </DropdownMenuItem>
              <SelectIndex user={user} indexId={indexId} />
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Your index role: {index.user_role}</DropdownMenuLabel>
          {index && isServerAdmin && <IndexMenuServerAdmin user={user} index={index} />}
        </DropdownMenuContent>
      </DropdownMenu>

      <NavLink index={index} path="dashboard" label="Dashboard" icon={<LayoutDashboard />} />
      <NavLink index={index} path="data" label="Fields & Data" icon={<DatabaseZap />} />
      <NavLink index={index} path="settings" label="Index Admin" icon={<Settings />} />
    </>
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
      <span>Indices</span>
    </button>
  );
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
      } flex h-full select-none items-center gap-3 border-primary px-4 outline-none hover:bg-foreground/10`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
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
        <DropdownMenuSubTrigger className={!index ? "hidden" : ""}>
          <User className="mr-2 h-4 w-4" />
          <span>Change your index role</span>
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
          <LibraryIcon className="mr-2 h-4 w-4" />
          <span>Select index</span>
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
