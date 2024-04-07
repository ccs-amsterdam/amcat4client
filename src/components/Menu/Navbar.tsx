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
    <nav className=" border-b-[1px]  border-foreground/30">
      <div className="flex  h-16 items-center justify-between ">
        <div className="flex h-full items-center">
          <IndexMenu />
        </div>
        <div className="grid flex-auto grid-cols-[repeat(auto-fit,2.5rem)] items-center justify-end gap-1">
          <ServerMenu />
          <ThemeToggle />
          <Refresh />
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}
