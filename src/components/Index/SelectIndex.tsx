"use client";

import useAmcatIndices from "@/api/indices";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { AmcatIndex } from "@/interfaces";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ArrowLeft, ArrowRight, ChevronRight, Folder, Grid, List, Trash2 } from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Toggle } from "../ui/toggle";
import { Tooltip, TooltipContent } from "../ui/tooltip";

const PAGESIZE = 16;

interface Folder {
  folders: Map<string, Folder>;
  indices: AmcatIndex[];
}

function get_root(indices: AmcatIndex[] | undefined, path: string[]): Folder | undefined {
  if (indices == null) return undefined;
  const root: Folder = { folders: new Map(), indices: [] };
  function get_folder(parent: Folder, children: string[]) {
    const head = children.shift();
    if (head == null) return parent;
    let f = parent.folders.get(head);
    if (f == null) {
      f = { folders: new Map(), indices: [] };
      parent.folders.set(head, f);
    }
    return get_folder(f, children);
  }
  indices.forEach((ix) => get_folder(root, ix.folder ? ix.folder.split("/") : []).indices.push(ix));

  let result: Folder | undefined = root;
  path
    .filter((f) => f)
    .forEach((f) => {
      result = result?.folders.get(f);
    });
  if (result == null) console.error(`Cannot find folder ${path}`);
  return result;
}

export function SelectIndex() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const { user, loading } = useMiddlecat();
  const { data: allIndices, isLoading: loadingIndices } = useAmcatIndices(user);
  const [search, setSearch] = useState("");
  const [isListView, setIsListView] = useState(false);
  const [page, setPage] = useState(0);
  const [indices, setIndices] = useState<AmcatIndex[] | undefined>(undefined);
  const [archived, setArchived] = useState(false);

  const currentPath = (params?.get("folder") ?? "").split("/").filter((x) => x);
  const folder = get_root(indices, currentPath);

  const nPages = Math.ceil((folder?.indices.length || 1) / PAGESIZE);
  const offset = page * PAGESIZE;
  const pageIndices = folder?.indices.slice(offset, offset + PAGESIZE);

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

  function onSelectIndex(index: AmcatIndex) {
    router.push(`/indices/${index.id}/dashboard`);
  }

  function nextPage() {
    setPage((page) => Math.min(page + 1, nPages - 1));
  }
  function prevPage() {
    setPage((page) => Math.max(page - 1, 0));
  }
  function toSubfolder(subfolder: string) {
    const newParams = new URLSearchParams(params ?? undefined);
    currentPath.push(subfolder);
    newParams.set("folder", currentPath.join("/"));
    router.push(`${pathname}?${newParams?.toString()}`);
  }

  if (loading || loadingIndices)
    return (
      <div className="mt-[20vh]">
        <Loading />
      </div>
    );
  if (indices === undefined) return null;
  const subfolders = [...(folder?.folders.keys() ?? [])];
  console.log(subfolders);
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0">
          <Link href="?folder=">My indices</Link>
          {currentPath.map((folder, ix) => (
            <>
              <ChevronRight className="inline text-sm text-foreground/60" />
              <Link href={`?folder=${currentPath.slice(0, ix + 1).join("/")}`}>{folder}</Link>
            </>
          ))}
          {/*allIndices?.length ? "Select an Index" : "This server does not have any indices you can view"*/}
        </h3>
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
            <Toggle pressed={isListView} onPressedChange={setIsListView} className="text-xs" variant="outline">
              {isListView ? <List className="mr-1 h-3 w-3" /> : <Grid className="mr-1 h-3 w-3" />}
              {isListView ? "List" : "Grid"}
            </Toggle>
          </Tooltip>
        </div>
      </div>
      <div></div>
      {/* Folders */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {subfolders.map((folder) => (
          <ProjectFolder key={folder} folder={folder} onClick={toSubfolder} />
        ))}
      </div>
      {/* Projects */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {pageIndices?.map((index) => <IndexCard key={index.id} index={index} />)}
      </div>
    </div>
  );
}

const ProjectFolder = ({ folder, onClick }: { folder: string; onClick: (folder: string) => void }) => (
  <Card className="cursor-pointer bg-secondary transition-colors hover:bg-secondary/75" onClick={() => onClick(folder)}>
    <CardHeader className="flex flex-row items-center gap-2 px-3 py-2">
      <Folder className="h-4 w-4" />
      <CardTitle className="text-sm">{folder}</CardTitle>
    </CardHeader>
  </Card>
);

const IndexCard = ({ index }: { index: AmcatIndex }) => {
  const style = index.image_url
    ? {
        backgroundImage: `url('${index.image_url}')`,
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "center",
        backgroundSize: "cover",
        backgroundPositionY: "center",
      }
    : {};

  console.log(style);
  return (
    <Link href={`/indices/${index.id}/dashboard`}>
      <Card style={style} className="h-40 overflow-hidden bg-primary/50">
        <CardHeader className="bg-background/70 p-3">
          <CardTitle className=" text-base">{index.name}</CardTitle>
          {index.description && (
            <CardDescription className="line-clamp-2 h-8 text-xs">{index.description}</CardDescription>
          )}
        </CardHeader>

        {/*project.externalUrl && (
      <CardFooter className="p-2">
        <Button variant="outline" size="sm" asChild className="w-full text-xs">
          <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1 h-3 w-3" />
            Visit
          </a>
        </Button>
      </CardFooter>
    )*/}
      </Card>
    </Link>
  );
};

const ProjectList = ({ projects }: { projects: AmcatIndex[] }) => (
  <div className="space-y-1">
    {projects.map((project) => (
      <div key={project.id} className="flex items-center justify-between rounded-md p-1 text-sm hover:bg-accent">
        <span>{project.name}</span>
        {/*project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )*/}
      </div>
    ))}
  </div>
);
