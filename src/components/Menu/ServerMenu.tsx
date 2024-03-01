"use client";

import { Server } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Index() {
  const router = useRouter();

  function goToServerPage() {
    router.push("/server");
  }
  return (
    <button
      onClick={goToServerPage}
      className="flex h-full select-none items-center gap-3 border-primary px-4  text-primary outline-none hover:bg-foreground/10"
    >
      <Server />
      <span className="hidden md:inline">Server</span>
    </button>
  );
}
