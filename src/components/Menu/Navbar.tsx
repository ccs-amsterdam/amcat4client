"use client";

import { useAmcatBranding } from "@/api/branding";
import useAutoSignin from "@/lib/useAutoSignin";
import Link from "next/link";
import AccountMenu from "./AccountMenu";
import IndexSubMenu from "./IndexSubMenu";
import { useParams, useRouter } from "next/navigation";
import ServerMenu from "./ServerMenu";
import { Notifications } from "./Notifications";
import IndexMenu from "./IndexMenu";
import { ChevronRight, Ellipsis, Library, SlashIcon } from "lucide-react";
import ServerSubMenu from "./ServerSubMenu";
import { usePathname } from "next/dist/client/components/navigation";

export default function Navbar() {
  const params = useParams<{ index: string }>();
  const hasIndex = !!params?.index;
  const path = usePathname();
  const { data: branding, isLoading: brandingLoading } = useAmcatBranding();
  useAutoSignin();

  function logo() {
    return (
      <Link href={branding?.server_url || "/"} className="flex items-center">
        <img className={`ml-2 mr-0 aspect-auto w-9 md:w-12 `} src={branding?.server_icon || "/logo.png"} alt="AmCAT" />
      </Link>
    );
  }

  function submenu() {
    if (hasIndex)
      return (
        <div className="flex h-9 w-full items-center justify-end  px-3  text-sm">
          <IndexSubMenu />
        </div>
      );
    if (path === "/")
      return (
        <div className="absolute z-50 flex h-9 w-full justify-start gap-1 px-1 py-1 text-sm">
          <ServerSubMenu />
        </div>
      );
  }

  return (
    <nav className={`relative z-50  text-sm`}>
      <div className={`select-none overflow-hidden border-b border-primary/30 bg-background  `}>
        <div className="flex items-center justify-between ">
          {logo()}
          <div className="flex h-14 items-center gap-1 px-3 text-sm md:text-base">
            <ServerLink serverName={branding?.server_name || "Server"} />
            <Separator />
            <IndicesLink hasIndex={hasIndex} />
            {/*{hasIndex ? (
              <>*/}
            <Separator />
            <IndexMenu />
            {/*</>
            ) : null}*/}
          </div>
          <div className="mr-2 flex h-full flex-1 items-center justify-end gap-3 px-2">
            <Notifications />
            <AccountMenu />
            {/*<ServerMenu />*/}
          </div>
        </div>
      </div>
      {submenu()}
    </nav>
  );
}

function Separator() {
  // return <SlashIcon className="h-3 w-3 opacity-50" />;
  return <ChevronRight className="h-4 w-4 opacity-50" />;
  // return <span className="text-foreground/40">|</span>;
  // return <span className="text-foreground/40">/</span>;
}

function ServerLink({ serverName }: { serverName: string }) {
  const router = useRouter();
  return (
    <button
      className={
        "flex h-full select-none items-center gap-1 whitespace-nowrap border-primary outline-none hover:bg-foreground/10 md:px-2"
      }
      onClick={() => router.push("/")}
    >
      {serverName}
    </button>
  );
}

function IndicesLink({ hasIndex }: { hasIndex: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const isActive = path?.startsWith("/indices");

  return (
    <button
      className={`${isActive ? "" : "text-foreground/50"} flex h-full select-none items-center gap-1 whitespace-nowrap border-primary outline-none hover:bg-foreground/10 md:px-2`}
      onClick={() => router.push("/indices")}
    >
      <div className="hidden md:block">Indices</div>
      <div className="block md:hidden">
        <Ellipsis className="h-4 w-4" />
      </div>
      {/*<div className="block md:hidden">{!hasIndex ? "Indices" : <Ellipsis className="h-4 w-4" />}</div>*/}
    </button>
  );
}
