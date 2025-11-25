"use client";

import { useAmcatConfig } from "@/api/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AmcatConfig } from "@/interfaces";
import { AlertCircle, Bot, Loader, LogInIcon, LogOut, UserCheck, UserX } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const Spinner = () => <Loader className="h-7 w-7 animate-[spin_2000ms_linear_infinite] text-primary" />;

export default function AccountMenu() {
  const { user, loading: loadingUser, signIn, signOut } = useMiddlecat();
  const { data: config, isLoading: loadingConfig } = useAmcatConfig();
  const router = useRouter();
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
        <DropdownMenuItem onClick={() => signOut(true).then(() => router.push("/"))}>
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

  if (loadingUser || loadingConfig)
    return (
      <div className="px-3">
        <Spinner />
      </div>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-full min-w-[2.5rem] px-3 outline-none hover:bg-primary/10">
        <UserIcon user={user} config={config} className="h-8 w-8  text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={13}
        className="mr-2  min-w-48 border-[1px] border-foreground"
      >
        <DropdownMenuLabel>{renderAuthStatus()}</DropdownMenuLabel>
        {renderAuthButtons()}
        <DropdownMenuItem onClick={() => router.push("/api_keys")}>
          <Bot className="mr-2 h-4 w-4" />
          <span>API Keys</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeToggle label={true} />
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
        className="h-8 w-8 rounded-full border-2 border-primary"
        referrerPolicy="no-referrer"
      />
    );
  return <UserCheck className={className} />;
}
