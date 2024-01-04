"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <SunMoon className="h-7 w-7" />;

  function renderIcon() {
    // if not on client
    if (typeof window === "undefined") return <SunMoon className="h-7 w-7" />;
    if (theme === "dark") return <Sun className="h-7 w-7" />;
    return <Moon className="h-7 w-7" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2 text-primary hover:text-primary/80"
    >
      {renderIcon()}
    </button>
  );
}
