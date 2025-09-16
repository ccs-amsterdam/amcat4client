"use client";

import { useAmcatConfig } from "@/api/config";
import { useIndex } from "@/api/index";
import { useHasGlobalRole } from "@/api/userDetails";
import { AmcatIndex } from "@/interfaces";
import { DatabaseZap, LayoutDashboard, Settings } from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";

const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

export default function IndexMenu() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const indexId = decodeURI(params?.index || "");
  const { data: index } = useIndex(user, indexId);
  const isServerAdmin = useHasGlobalRole(user, "ADMIN");
  if (loading || !user) return null;
  if (!index) return null;

  return (
    <>
      <NavLink index={index} path="dashboard" label="Dashboard" icon={<LayoutDashboard />} />
      <NavLink index={index} path="data" label="Data" icon={<DatabaseZap />} />
      <NavLink index={index} path="settings" label="Settings" icon={<Settings />} />
    </>
  );
}

function useCurrentPath() {
  const path = usePathname();
  if (!path) return "";
  const pathParts = path.split("/");
  return pathParts[pathParts.length - 1] || "";
}

function NavLink({ index, path, label, icon }: { index: AmcatIndex; path: string; label: string; icon: JSX.Element }) {
  const router = useRouter();
  const currentPath = useCurrentPath();
  const { data: serverConfig } = useAmcatConfig();
  const no_auth = serverConfig?.authorization === "no_auth";

  const active = path === currentPath;
  const href = `/indices/${index.id}/${path}`;
  const indexRole = index?.user_role || "NONE";
  const admin = no_auth || indexRole === "ADMIN";
  const writer = admin || indexRole === "WRITER";

  if (!admin) {
    if (path === "users" || path === "settings") return null;
  }
  if (!writer) {
    if (path === "users" || path === "settings" || path === "data") return null;
    if (path === "dashboard" && active) return null;
  }

  return (
    <button
      onClick={() => router.push(href)}
      className={`${
        active ? "text-primary" : "text-foreground/80"
      } flex h-full select-none items-center gap-3 border-primary px-2 outline-none hover:bg-foreground/10 lg:px-4`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
