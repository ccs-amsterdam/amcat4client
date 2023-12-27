"use client";

import React, { useEffect, useState } from "react";

import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import {
  Moon,
  Sun,
  AlertCircle,
  Library,
  Loader,
  LogInIcon,
  LogOut,
  Server,
  SunMoon,
  UserCheck,
  UserX,
  Users,
  User,
  Database,
} from "lucide-react";
import { useAmcatConfig } from "@/api/config";
import { AmcatConfig, AmcatIndex, AmcatIndexName } from "@/interfaces";
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
} from "./ui/dropdown-menu";
import { useParams, usePathname, useRouter } from "next/navigation";
import useAutoSignin from "@/lib/useAutoSignin";
import { useTheme } from "next-themes";
import { useIndexDetails } from "@/api/indexDetails";
import { useMyGlobalRole } from "@/api/userDetails";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";
import { useMutateIndexUser } from "@/api/indexUsers";
import { amcatUserRoleSchema } from "@/schemas";

const Spinner = () => <Loader className="h-7 w-7 animate-[spin_2000ms_linear_infinite] text-primary" />;
const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

export default function Navbar() {
  useAutoSignin();

  return (
    <nav className=" border-b-[1px]  border-foreground/30  px-4 py-2">
      <div className="flex h-12 items-center justify-between ">
        <IndexMenu />
        <div className="grid grid-cols-[2.5rem,2.5rem] items-center gap-1">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}

function ServerMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-full items-center gap-3 border-primary text-primary outline-none">
        <Database />
      </DropdownMenuTrigger>
      <DropdownMenuContent></DropdownMenuContent>
    </DropdownMenu>
  );
}

function IndexMenu() {
  const path = usePathname();

  const { user, loading } = useMiddlecat();
  const role = useMyGlobalRole(user);
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const index = params?.index;
  const { data: indexDetails } = useIndexDetails(user, index);

  function currentPath() {
    if (!index || !path) return null;
    const pathParts = path.split("/");
    return pathParts[pathParts.length - 1];
  }

  if (loading) return <Spinner />;
  if (!user) return <div />;

  const isServerAdmin = role === "ADMIN";
  const isIndexWriter = indexDetails?.user_role === "ADMIN" || indexDetails?.user_role === "WRITER";
  if (!isServerAdmin && !isIndexWriter) return <div />;

  return (
    <div className="flex h-full items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-full items-center gap-3 border-primary text-primary outline-none">
          <Database />
          <div className="hidden gap-3 md:flex">
            {index?.replaceAll("_", " ")}
            <span className="text-primary/50">{currentPath()}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px] border-[1px] border-foreground">
          {isServerAdmin && <IndexMenuServerAdmin user={user} indexDetails={indexDetails} />}
          {isServerAdmin && isIndexWriter && <DropdownMenuSeparator />}
          {isIndexWriter && <IndexMenuIndexAdmin user={user} indexDetails={indexDetails} />}

          {/* <DropdownMenuItem onClick={() => router.push("/")}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Close Index</span>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function IndexMenuServerAdmin({ user, indexDetails }: { user: MiddlecatUser; indexDetails?: AmcatIndex }) {
  const router = useRouter();
  const role = useMyGlobalRole(user);
  const { mutate } = useMutateIndexUser(user, indexDetails?.name);

  if (role !== "ADMIN") return null;

  function onChangeRole(role: string) {
    mutate({ email: user.email, role });
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>ADMIN actions</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => router.push(`/users`)}>
        <Users className="mr-2 h-4 w-4" />
        <span>Manage server users</span>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className={!indexDetails ? "hidden" : ""}>
          <User className="mr-2 h-4 w-4" />
          <span>change my index role</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup
            value={indexDetails?.user_role}
            onSelect={(e) => e.preventDefault()}
            onValueChange={onChangeRole}
          >
            {roles.map((role) => {
              return (
                <DropdownMenuRadioItem key={role} value={role} onSelect={(e) => e.preventDefault()}>
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

function IndexMenuIndexAdmin({ user, indexDetails }: { user: MiddlecatUser; indexDetails: AmcatIndex }) {
  const router = useRouter();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Index settings</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => router.push(`/index/${indexDetails.name}/users`)}>
        <Users className="mr-2 h-4 w-4" />
        <span>Users</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => router.push(`/index/${indexDetails.name}/fields`)}>
        <Server className="mr-2 h-4 w-4" />
        <span>Fields</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <SunMoon className="h-7 w-7" />;

  function renderIcon() {
    // if not on client
    if (typeof window === "undefined") return <SunMoon className="h-7 w-7" />;
    if (theme === "dark") return <Sun className="h-7 w-7" />;
    return <Moon className="h-7 w-7" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2 text-primary hover:text-primary/80"
    >
      {renderIcon()}
    </button>
  );
}

function AccountMenu() {
  const { user, loading: loadingUser, signIn, signOut } = useMiddlecat();
  const { data: config, isLoading: loadingConfig } = useAmcatConfig();

  function renderAuthStatus() {
    if (config?.authorization === "no_auth") return "Authorization disabled";
    if (!user) return "not signed in";
    if (!user.authenticated) return "not signed in";

    return (
      <div className="flex flex-nowrap items-center">
        <span title={user.email} className="max-w-[15rem] overflow-hidden overflow-ellipsis whitespace-nowrap">
          {user.email}
        </span>
      </div>
    );
  }

  function renderAuthButtons() {
    if (config?.authorization === "no_auth") return null;
    if (user?.authenticated) {
      return (
        <DropdownMenuItem onClick={() => signOut(true)}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign-out</span>
        </DropdownMenuItem>
      );
    } else {
      return (
        <DropdownMenuItem onClick={() => signIn()}>
          <LogInIcon className="mr-2 h-4 w-4" />
          <span>Sign-in</span>
        </DropdownMenuItem>
      );
    }
  }

  if (loadingUser || loadingConfig) return <Spinner />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="min-w-[2.5rem] outline-none">
        <UserIcon user={user} config={config} className="h-7 w-7  text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" sideOffset={13} className="mr-2  border-[1px] border-foreground">
        <DropdownMenuLabel>{renderAuthStatus()}</DropdownMenuLabel>
        {renderAuthButtons()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserIcon({
  user,
  config,
  className,
}: {
  user: MiddlecatUser | undefined;
  config: AmcatConfig | undefined;
  className: string;
}) {
  if (config) {
    if (config.authorization === "no_auth") return <AlertCircle className={className} />;
  }

  if (!user?.authenticated) return <UserX className={className} />;
  if (user?.image)
    return (
      <img
        src={user.image}
        alt="profile"
        className="h-7 w-7 rounded-full shadow-sm shadow-foreground/50"
        referrerPolicy="no-referrer"
      />
    );
  return <UserCheck className={className} />;
}
