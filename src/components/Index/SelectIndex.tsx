"use client";

import useAmcatIndices from "@/api/indices";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { AmcatIndices } from "@/interfaces";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent } from "../ui/tooltip";

const PAGESIZE = 16;

export function SelectIndex() {
  const router = useRouter();
  const { user, loading } = useMiddlecat();
  const { data: allIndices, isLoading: loadingIndices } = useAmcatIndices(user);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [indices, setIndices] = useState<AmcatIndices | undefined>(undefined);
  const [archived, setArchived] = useState(false);

  const nPages = Math.ceil((indices?.length || 1) / PAGESIZE);
  const offset = page * PAGESIZE;
  const pageIndices = indices?.slice(offset, offset + PAGESIZE);

  useEffect(() => {
    if (!allIndices) return;
    const timeout = setTimeout(() => {
      setIndices(
        allIndices.filter((index) => {
          if (!!index.archived && !archived) return false;
          if (!search) return true;
          if (index.name.toLowerCase().includes(search.toLowerCase())) return true;
          if (index.id.toLowerCase().includes(search.toLowerCase())) return true;
          return false;
        }),
      );
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, archived, allIndices]);

  useEffect(() => {
    if (page >= nPages) setPage(nPages - 1);
  }, [nPages]);

  function onSelectIndex(indexId: string) {
    router.push(`/index/${indexId}/dashboard`);
  }

  function nextPage() {
    setPage((page) => Math.min(page + 1, nPages - 1));
  }
  function prevPage() {
    setPage((page) => Math.max(page - 1, 0));
  }

  if (loading || loadingIndices)
    return (
      <div className="mt-[20vh]">
        <Loading />
      </div>
    );
  if (indices === undefined) return null;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
        <h2 className="m-0">
          {allIndices?.length ? "Select an Index" : "This server does not have any indices you can view"}
        </h2>
        <div className={` Pagination flex items-center gap-3 ${allIndices?.length ? "" : "hidden"} `}>
          <div className="flex">
            <Button variant="ghost" onClick={prevPage} disabled={page === 0} className="px-2 disabled:opacity-50">
              <ArrowLeft />
            </Button>
            <Button
              variant="ghost"
              onClick={nextPage}
              disabled={page === nPages - 1}
              className="px-2 disabled:opacity-50"
            >
              <ArrowRight />
            </Button>
          </div>
          <Input
            className="w-36 border-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={` ${archived ? "bg-secondary hover:bg-secondary/80" : ""} border-foreground/50 `}
                onClick={() => setArchived(!archived)}
              >
                <Trash2 className={`h-5 w-5 ${archived ? "text-secondary-foreground" : "text-foreground/50"}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Show archived projects</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {pageIndices?.map((index) => {
          // if (index.archived) return null;
          return (
            <Button
              variant={index.archived ? "secondary" : "default"}
              className="flex h-full w-full flex-col items-start text-left"
              key={index.id}
              onClick={() => onSelectIndex(index.id)}
            >
              <div className=" w-full overflow-hidden text-ellipsis whitespace-nowrap   text-lg font-semibold">
                {index.name}
              </div>
              <div className=" w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm">
                {index.id}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
