"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  label?: boolean;
}

export default function ThemeToggle({ label }: ThemeToggleProps) {
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
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex items-center gap-2 ">
      {renderIcon()}
      {label ? (theme === "dark" ? "Light mode" : "Dark mode") : ""}
    </button>
  );
}
