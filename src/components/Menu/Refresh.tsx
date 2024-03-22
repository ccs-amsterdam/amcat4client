"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
        toast.loading("Refreshing data...");
      }}
      className="flex items-center gap-2 text-primary hover:text-primary/80 disabled:text-foreground/50"
    >
      <RefreshCw className="h-7 w-7" />
    </button>
  );
}
