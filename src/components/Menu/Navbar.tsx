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
import { ChevronRight, Library } from "lucide-react";

export default function Navbar() {
  const params = useParams<{ index: string }>();
  const hasIndex = !!params?.index;
  const { data: branding, isLoading: brandingLoading } = useAmcatBranding();
  useAutoSignin();

  function logo() {
    return (
      <Link href={branding?.server_url || "/"} className="flex items-center">
        <img className={`ml-2 mr-0 aspect-auto w-9 md:w-12 `} src={branding?.server_icon || "/logo.png"} alt="AmCAT" />
      </Link>
    );
  }

  return (
    <nav className={`z-50 bg-background text-sm `}>
      <div className={`select-none overflow-hidden border-b border-primary/30  `}>
        <div className="flex items-center justify-between ">
          {logo()}
          <div className="flex h-14 items-center gap-1 px-3 text-sm md:gap-2 md:text-base">
            <ServerMenu />
            <Separator />
            {/*<IndicesLink />
            <Separator />*/}
            {/*<span className="text-foreground/40">|</span>*/}
            <IndexMenu />
          </div>
          <div className="mr-2 flex h-full flex-1 items-center justify-end gap-3 px-2">
            <Notifications />
            <AccountMenu />
            {/*<ServerMenu />*/}
          </div>
        </div>
      </div>
      {hasIndex ? (
        <div className="flex h-9 w-full items-center justify-end  px-3  text-sm">
          <IndexSubMenu />
        </div>
      ) : null}
    </nav>
  );
}

function Separator() {
  // return <SlashIcon className="h-4 w-4 opacity-50" />;
  return <ChevronRight className="h-4 w-4 opacity-50" />;
  // return <span className="text-foreground/40">|</span>;
  // return <span className="text-foreground/40">/</span>;
}

function IndicesLink() {
  const router = useRouter();
  return (
    <button
      className={
        "flex h-full select-none items-center gap-1 whitespace-nowrap border-primary outline-none hover:bg-foreground/10 md:px-2"
      }
      onClick={() => router.push("/indices")}
    >
      <div className=" flex items-center gap-1 lg:gap-2">
        <Library className=" opacity-70 md:h-6 md:w-6" />
      </div>
    </button>
  );
}
