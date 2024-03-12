"use client";

import { Server } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Index() {
  const router = useRouter();
  const path = usePathname();
  if (path && /^\/index/.test(path)) return null;
  const active = path === "/server";

  function goToServerPage() {
    router.push("/server");
  }
  return (
    <button
      onClick={goToServerPage}
      className={`
      ${active ? "text-primary" : "text-foreground/80"}
      flex h-full select-none items-center gap-3 border-primary px-4   outline-none hover:bg-foreground/10`}
    >
      <Server />
      <span className="hidden md:inline">Server</span>
    </button>
  );
}
