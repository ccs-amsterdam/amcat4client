"use client";

import React from "react";
import Link from "next/link";

import Logo from "@/images/amcat-logo.svg";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { AlertCircle, Loader, LogOut, UserCheck, UserX } from "lucide-react";
import { useUrlHost } from "@/lib/urlHost";
import { AmcatConfig, useAmcatConfig } from "@/amcat/api/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Navbar() {
  return (
    <nav className="border-b-[1px] border-secondary/20  bg-primary/20  px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logo className="h-10 w-10 rounded-full shadow-md shadow-gray-300" />
        </Link>
        <AccountMenu />
      </div>
    </nav>
  );
}

function AccountMenu() {
  const { user, loading: loadingUser, signIn, signOut, fixedResource } = useMiddlecat();
  const host = useUrlHost();
  const { data: config, isLoading: loadingConfig } = useAmcatConfig(host);
  const router = useRouter();

  if (!host) return null;
  if (loadingUser || loadingConfig) return <Loader className="animate-spin" />;

  const canSignIn = config?.authorization !== "no_auth" && !user?.authenticated;
  const canSignOut = config?.authorization !== "no_auth" && user?.authenticated;

  function changeServer() {
    if (user) signOut(false);
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <UserIcon user={user} config={config} className="h-8 w-8 p-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" sideOffset={20} className="mr-2 border-[1px] border-gray-400">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={changeServer}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Change Server</span>
        </DropdownMenuItem>
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
  return <UserCheck className={className} />;
}
