"use client";

import useAutoSignin from "@/lib/useAutoSignin";
import AccountMenu from "./AccountMenu";
import ServerMenu from "./ServerMenu";
import ThemeToggle from "./ThemeToggle";
import IndexMenu from "./IndexMenu";
import Refresh from "./Refresh";

export default function Navbar() {
  useAutoSignin();

  return (
    <nav className="mainnav sticky gap-3 border-b-[1px] border-foreground/30 bg-background text-foreground">
      <div className="flex  h-16 items-center justify-between ">
        <div className="flex h-full items-center">
          <IndexMenu />
        </div>
        <div className="flex flex-auto items-center justify-end gap-3">
          <ServerMenu />
          <ThemeToggle />
          <Refresh />
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}
