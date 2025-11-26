"use client";

import { useIndex } from "@/api/index";
import { useAmcatIndices } from "@/api/indices";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AmcatIndex, AmcatIndexId } from "@/interfaces";
import { CommandEmpty } from "cmdk";
import { ChevronDown } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import useLocalStorage from "@/lib/useLocalStorage";

export default function IndexMenu() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const indexId = decodeURI(params?.index || "");
  const [open, setOpen] = useState(false);

  const { data: index } = useIndex(user, indexId);

  if (loading || !user) return null;

  function current() {
    if (indexId)
      return (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
          {index?.name || "loading index..."}
        </span>
      );
    return <span className="text-foreground/80">select index</span>;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={`flex h-full min-w-0  select-none items-center gap-1 px-1 outline-none hover:font-semibold md:px-3 ${open ? "font-semibold" : ""}`}
      >
        {current()}
        <ChevronDown className="h-4 w-4 opacity-50" />
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
  // const { data: indices } = useAmcatIndices(user, false, true);
  const [indices] = useLocalStorage<AmcatIndex[]>("recentIndices", []);
  const router = useRouter();

  function onSelectIndex(index: string) {
    router.push(`/indices/${index}/dashboard`);
    onSelect();
  }

  return (
    <Command>
      <CommandInput placeholder="Recent indices" autoFocus={true} className="h-9" />
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
  );
}
