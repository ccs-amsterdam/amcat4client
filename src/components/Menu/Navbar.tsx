"use client";

import Image from "next/image";

import useAutoSignin from "@/lib/useAutoSignin";
import AccountMenu from "./AccountMenu";
import ServerMenu from "./ServerMenu";
import ThemeToggle from "./ThemeToggle";
import IndexMenu from "./IndexMenu";
import Refresh from "./Refresh";
import Link from "next/link";
import { useAmcatBranding } from "@/api/branding";
import ReactMarkdown from "react-markdown";

export default function Navbar() {
  useAutoSignin();
  const { data: serverBranding } = useAmcatBranding();

  if (serverBranding == null) return null;

  return (
    <nav className="mainnav sticky gap-3 border-b-[1px] border-foreground/30 bg-background text-foreground">
      <div className="flex h-16 items-center justify-between ">
        <div className="flex h-full flex-1 items-center">
          <Link href="/">
            <Image className="mx-2 px-1" src={"/logo.png"} alt="AmCAT" width={64} height={55} />
          </Link>
          <IndexMenu />
        </div>
        <div className="mx-auto hidden h-7 justify-center whitespace-nowrap sm:block">{serverBranding.server_name}</div>

        <div className="flex flex-1 items-center justify-end gap-3 px-2">
          <AccountMenu />
          <ServerMenu />
        </div>
      </div>
    </nav>
  );
}
