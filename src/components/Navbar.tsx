"use client";

import React, { useEffect } from "react";
import Link from "next/link";

import Logo from "@/images/amcat-logo.svg";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { AlertCircle, Loader, LogInIcon, LogOut, Network, Server, UserCheck, UserX } from "lucide-react";
import { useAmcatConfig } from "@/amcat/api/config";
import { AmcatConfig } from "@/amcat/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import useAutoSignin from "@/lib/useAutoSignin";

export default function Navbar() {
  useAutoSignin();

  return (
    <nav className=" border-b-[1px]  border-secondary/20  bg-primary/20 px-4 py-2">
      <div className="flex h-10 items-center justify-between">
        <Link href="/">
          <Logo className="h-6 w-6 rounded-full shadow-md shadow-gray-300" />
        </Link>
        <div className="flex items-center gap-2">
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}

function AccountMenu() {
  const { user, loading: loadingUser, signIn, signOut, fixedResource } = useMiddlecat();
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

  if (loadingUser || loadingConfig) return <Loader className="animate-spin" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <UserIcon user={user} config={config} className="h-8 w-8 p-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" sideOffset={20} className="mr-2  border-[1px] border-gray-400">
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
        className="h-8 w-8 rounded-full border-[1px] border-secondary/40"
        referrerPolicy="no-referrer"
      />
    );
  return <UserCheck className={className} />;
}
