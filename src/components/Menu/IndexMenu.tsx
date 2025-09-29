"use client";

import { useAmcatBranding } from "@/api/branding";
import { useIndex } from "@/api/index";
import useAmcatIndices from "@/api/indices";
import { useHasGlobalRole } from "@/api/userDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AmcatIndexId } from "@/interfaces";
import { CommandEmpty } from "cmdk";
import { Book, ChevronDown, LibraryIcon } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

export default function IndexMenu() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const path = usePathname();
  const indexId = decodeURI(params?.index || "");
  const [open, setOpen] = useState(false);

  const { data: index, isLoading: indexLoading } = useIndex(user, indexId);
  const { data: branding, isLoading: brandingLoading } = useAmcatBranding();

  const isServerAdmin = useHasGlobalRole(user, "ADMIN");

  const [serverInfoOpen, setServerInfoOpen] = useState(false);
  const [serverAccessOpen, setServerAccessOpen] = useState(false);

  if (loading || !user) return null;

  function current() {
    if (indexId) return index?.name || "loading index...";
    return <span className="text-foreground/50">select index</span>;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={
          "flex h-full select-none items-center gap-1 whitespace-nowrap border-primary outline-none hover:bg-foreground/10 md:px-2"
        }
      >
        <div className=" flex items-center gap-1 lg:gap-2">
          <div className="max-w-[25vw]  overflow-hidden text-ellipsis">{current()}</div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="ml-2 w-[200px] max-w-[95vw] border-[1px] border-foreground">
        <SelectIndex user={user} indexId={indexId} onSelect={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SelectIndex({
  user,
  indexId,
  onSelect,
}: {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  onSelect: () => void;
}) {
  const { data: indices } = useAmcatIndices(user);
  const router = useRouter();

  function onSelectIndex(index: string) {
    router.push(`/indices/${index}/dashboard`);
    onSelect();
  }

  return (
    // <DropdownMenuGroup>
    //   <DropdownMenuSub>
    //     <DropdownMenuSubTrigger className="">
    //       <Book className="mr-2 h-4 w-4" />
    //       <span>Quick select</span>
    //     </DropdownMenuSubTrigger>
    <Command>
      <CommandInput placeholder="Filter indices" autoFocus={true} className="h-9" />
      <CommandList>
        <CommandEmpty>No index found</CommandEmpty>
        <CommandGroup>
          {indices?.map((index) => {
            if (index.id === indexId) return null;
            if (index.archived) return null;
            return (
              <CommandItem key={index.id} value={index.id} onSelect={(value) => onSelectIndex(value)}>
                <span>{index.name.replaceAll("_", " ")}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
    //   </DropdownMenuSub>
    // </DropdownMenuGroup>
  );
}
