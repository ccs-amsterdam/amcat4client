"use client";

import { useAmcatBranding } from "@/api/branding";
import useAutoSignin from "@/lib/useAutoSignin";
import Link from "next/link";
import AccountMenu from "./AccountMenu";
import { useParams, useRouter } from "next/navigation";
import ServerMenu from "./ServerMenu";
import { Notifications } from "./Notifications";
import IndexMenu from "./IndexMenu";
import {
  ChevronRight,
  Columns3Cog,
  DatabaseZap,
  LayoutDashboard,
  Library,
  LockKeyholeOpen,
  Paintbrush,
  Settings,
  Users,
} from "lucide-react";
import { usePathname } from "next/dist/client/components/navigation";
import { AmcatBranding } from "@/interfaces";
import { SubMenu, SubMenuPath } from "./SubMenu.tsx";

const serverSubMenuPaths: SubMenuPath[] = [
  { href: "indices", label: "Indices", Icon: Library, minServerRole: "NONE" },
  { href: "branding", label: "Branding", Icon: Paintbrush, minServerRole: "ADMIN" },
  { href: "users", label: "Server users", Icon: Users, minServerRole: "ADMIN" },
  { href: "access", label: "Server role", Icon: LockKeyholeOpen, minServerRole: "NONE" },
];

const indexSubMenuPaths: SubMenuPath[] = [
  { href: "dashboard", label: "Dashboard", Icon: LayoutDashboard, minIndexRole: "METAREADER" },
  { href: "data", label: "Data", Icon: DatabaseZap, minIndexRole: "WRITER" },
  { href: "fields", label: "Fields", Icon: Columns3Cog, minIndexRole: "WRITER" },
  { href: "settings", label: "Settings", Icon: Settings, minIndexRole: "ADMIN" },
  { href: "users", label: "Users", Icon: Users, minIndexRole: "ADMIN" },
  { href: "access", label: "Access", Icon: LockKeyholeOpen, minIndexRole: "NONE" },
];

export default function Navbar() {
  const params = useParams<{ index: string }>();
  const hasIndex = !!params?.index;
  const path = usePathname();
  const { data: branding, isLoading: brandingLoading } = useAmcatBranding();
  useAutoSignin();

  function logo() {
    return (
      <Link href={"/"} className="flex h-14 items-center px-3 hover:bg-foreground/10">
        <img
          className={`mr-0 aspect-auto w-9 min-w-9 sm:w-10 `}
          src={branding?.server_icon || "/logo.png"}
          alt="AmCAT"
        />
      </Link>
    );
  }

  function submenu() {
    if (hasIndex) return <SubMenu paths={indexSubMenuPaths} basePath={`/indices/${params.index}`} />;
    if (path !== "/") return <SubMenu paths={serverSubMenuPaths} />;
    return null;
  }

  return (
    <nav className={`z-40  border-b border-primary/30 text-sm`}>
      <div className={`select-none overflow-hidden  bg-background  `}>
        <div className="flex h-full items-center justify-between">
          {logo()}
          <BreadCrumbs branding={branding} hasIndex={hasIndex} />
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

function BreadCrumbs({ branding, hasIndex }: { branding?: AmcatBranding; hasIndex: boolean }) {
  const path = usePathname();
  const homepage = path === "/";

  const serverLinkLabel = branding?.server_name || "server";

  return (
    <>
      <div className="hidden h-14  items-center  gap-1 overflow-hidden pl-2  text-sm sm:flex  md:text-base">
        <BreadCrumbLink name={serverLinkLabel} href="/indices" active={!homepage && !hasIndex} />
        {/*<ChevronRight className="h-4 w-4 min-w-4 flex-shrink opacity-50" />*/}
        <span className="text-primary/50">|</span>
        <IndexMenu />
      </div>
      <div className="flex h-14 flex-col items-start overflow-hidden  py-1 pl-2  text-sm sm:hidden  md:text-base">
        <BreadCrumbLink name={serverLinkLabel} href="/indices" active={!homepage && !hasIndex} />
        <IndexMenu />
      </div>
    </>
  );
}

function BreadCrumbLink({ name, href, active = true }: { name: string; href: string; active?: boolean }) {
  const router = useRouter();
  return (
    <button
      className={`${active ? "font-semibold" : "text-foreground/90"}
        flex h-full min-w-0  select-none items-center gap-1  text-ellipsis whitespace-nowrap border-primary  px-2 outline-none hover:bg-foreground/10`}
      onClick={() => router.push(href)}
    >
      {name}
    </button>
  );
}
