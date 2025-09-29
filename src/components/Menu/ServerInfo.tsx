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
        <DropdownMenuLabel>Server</DropdownMenuLabel>
        <Link
          href={branding?.server_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className=" text-primary hover:underline"
        >
          <DropdownMenuItem className="flex items-center gap-1">
            <LinkIcon className="mr-2 h-4 w-4" />
            {branding?.server_url || "Loading..."}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <Link
          href={config?.resource || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className=" text-primary hover:underline"
        >
          <DropdownMenuItem className="flex items-center gap-1">
            <LinkIcon className="mr-2 h-4 w-4" />
            {config?.resource || "Loading..."}
          </DropdownMenuItem>
        </Link>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
