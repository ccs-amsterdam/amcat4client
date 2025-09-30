import { useAmcatConfig } from "@/api/config";
import { Dialog, DialogContent } from "../ui/dialog";
import { useAmcatBranding } from "@/api/branding";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { Info, InfoIcon, LinkIcon } from "lucide-react";
import { Loading } from "../ui/loading";
import Link from "next/link";

export function ServerInfoDropdownSub({}) {
  const { data: config, isLoading: configLoading } = useAmcatConfig();
  const { data: branding, isLoading: brandingLoading } = useAmcatBranding();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger disabled={configLoading || brandingLoading}>
        <LinkIcon className="mr-2 h-4 w-4" />
        {"External links"}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-80">
        <Link
          href={branding?.server_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="  font-mono text-primary"
        >
          <DropdownMenuItem className="flex cursor-pointer items-center gap-5">
            <b className="w-12 text-foreground">Server</b>
            {branding?.server_url || "Loading..."}
          </DropdownMenuItem>
        </Link>
        <Link
          href={config?.resource || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="   font-mono text-primary"
        >
          <DropdownMenuItem className="flex cursor-pointer items-center gap-5">
            <b className="w-12 text-foreground  ">Project</b>
            {config?.resource || "Loading..."}
          </DropdownMenuItem>
        </Link>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
