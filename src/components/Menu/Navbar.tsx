"use client";

import useAutoSignin from "@/lib/useAutoSignin";
import AccountMenu from "./AccountMenu";
import IndexMenu from "./IndexMenu";
import ServerMenu from "./ServerMenu";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  useAutoSignin();

  return (
    <nav className=" border-b-[1px]  border-foreground/30">
      <div className="flex  h-16 items-center justify-between ">
        <div className="flex h-full items-center">
          <ServerMenu />
          <IndexMenu />
        </div>
        <div className="grid grid-cols-[2.5rem,2.5rem] items-center gap-1">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}
