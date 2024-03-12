"use client";

import { use, useEffect, useState } from "react";
import { Moon, RefreshCw, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";

export default function Refresh() {
  const queryClient = useQueryClient();
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisabled(false);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [disabled]);

  return (
    <button
      disabled={disabled}
      onClick={() => {
        setDisabled(true);
        queryClient.invalidateQueries();
      }}
      className="flex items-center gap-2 text-primary hover:text-primary/80 disabled:text-foreground/50"
    >
      <RefreshCw className="h-7 w-7" />
    </button>
  );
}