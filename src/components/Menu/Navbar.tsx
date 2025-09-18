"use client";

import Image from "next/image";

import { useAmcatBranding } from "@/api/branding";
import useAutoSignin from "@/lib/useAutoSignin";
import Link from "next/link";
import AccountMenu from "./AccountMenu";
import IndexMenu from "./IndexMenu";
import { useParams } from "next/navigation";
import MainMenu from "./MainMenu";
import { useEffect, useState } from "react";
import IndexRole from "./IndexRole";

export default function Navbar() {
  useAutoSignin();

  const params = useParams<{ index: string }>();
  const showingIndex = params?.index !== undefined;

  return (
    <nav className={`z-50 border-b-[1px] bg-background `}>
      <div className={`select-none overflow-hidden bg-primary/0`}>
        <div className="flex h-16 items-center justify-between ">
          <div className="flex h-full  items-center">
            {/*<Link href="/" className={showingIndex ? "hidden" : ""}>
            <img className="mx-2 px-1" src={"/logo.png"} alt="AmCAT" width={52} height={45} />
          </Link>*/}
            <MainMenu />
            <IndexMenu />
          </div>

          {/*<div className={`hidden whitespace-nowrap ${showingIndex ? "" : "sm:block"} `}>
          <ServerBranding />
        </div>*/}

          <div className="mr-2 flex h-full flex-1 items-center justify-end gap-3 px-2">
            <IndexRole />
            <AccountMenu />
            {/*<ServerMenu />*/}
          </div>
        </div>
      </div>
    </nav>
  );
}

function ServerBranding() {
  const { data: serverBranding } = useAmcatBranding();
  if (serverBranding == null) return null;
  const logo = (
    <div className="flex items-center gap-1 whitespace-nowrap">
      {serverBranding.server_icon ? (
        <img alt="Server icon" src={serverBranding.server_icon} className="mr-2 inline h-8" />
      ) : null}
      {serverBranding.server_name}
    </div>
  );
  return serverBranding.server_url ? <Link href={serverBranding.server_url}>{logo}</Link> : logo;
}
