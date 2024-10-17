"use client";

import { useAmcatConfig } from "@/api/config";
import { useMyGlobalRole } from "@/api/userDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AmcatConfig } from "@/interfaces";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { AlertCircle, Loader, LogInIcon, LogOut, UserCheck, UserX } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useRouter } from "next/navigation";

const Spinner = () => <Loader className="h-7 w-7 animate-[spin_2000ms_linear_infinite] text-primary" />;

export default function AccountMenu() {
  const { user, loading: loadingUser, signIn, signOut } = useMiddlecat();
  const { data: config, isLoading: loadingConfig } = useAmcatConfig();
  const globalRole = useMyGlobalRole(user);
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

  if (loadingUser || loadingConfig) return <Spinner />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="min-w-[2.5rem] outline-none">
        <UserIcon user={user} config={config} className="h-7 w-7  text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" sideOffset={13} className="mr-2  border-[1px] border-foreground">
        <DropdownMenuLabel>{renderAuthStatus()}</DropdownMenuLabel>
        {renderAuthButtons()}
        {!globalRole ? null : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Your server role: {globalRole}</DropdownMenuLabel>
          </>
        )}
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
