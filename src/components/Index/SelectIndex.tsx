"use client";

import { useMutateIndex } from "@/api";
import useAmcatIndices from "@/api/indices";
import { useHasGlobalRole } from "@/api/userDetails";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { AmcatIndex } from "@/interfaces";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  ArchiveRestore,
  ChevronRight,
  CornerLeftUp,
  FilePlus,
  Folder,
  FolderPlus,
  MoreVertical,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { CreateIndex } from "./CreateIndex";

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
  const params = useSearchParams();
  const { user, loading } = useMiddlecat();
  const { data: allIndices, isLoading: loadingIndices } = useAmcatIndices(user);
  const [currentPath, setCurrentPath] = useState<string[]>(params?.get("folder")?.split("/") ?? []);
  const [search, setSearch] = useState("");
  const [seeArchived, setSeeArchived] = useState(false);
  const [seeUnowned, setSeeUnowned] = useState(false);
  const [visibleIndices, setVisibleIndices] = useState<AmcatIndex[]>([]);
  const [visibleFolders, setVisibleFolders] = useState<string[]>([]);
  const canCreate = useHasGlobalRole(user, "WRITER");

  //const [isListView, setIsListView] = useState(false);

  useEffect(() => {
    if (!allIndices) return;
    const timeout = setTimeout(() => {
      const prefix = currentPath.join("/").replace(/^\/|\/$/, "");
      setVisibleIndices(
        allIndices.filter((index) => {
          if (!!index.archived && !seeArchived) return false;
          if ((index.folder ?? "") !== prefix) return false;
          if (!seeUnowned && index.user_role === "NONE") return false;
          if (!search) return true;
          if (index.name.toLowerCase().includes(search.toLowerCase())) return true;
          if (index.id.toLowerCase().includes(search.toLowerCase())) return true;
          return false;
        }),
      );
      const folderSet = new Set<string>();
      allIndices.forEach((ix) => {
        if (!ix.folder) return;
        const path = ix.folder.split("/");
        const head = path.pop();
        if (head == null || path.join("/") !== prefix) return;
        folderSet.add(head);
      });
      setVisibleFolders([...folderSet]);
    }, 200);
    return () => clearTimeout(timeout);
  }, [allIndices, search, currentPath, seeArchived, seeUnowned]);

  function toFolder(folder: string[]) {
    history.replaceState(null, "", `?folder=${folder.join("/")}`);
    setCurrentPath(folder);
  }

  if (loading || loadingIndices)
    return (
      <div className="mt-[20vh]">
        <Loading />
      </div>
    );
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0">
          {[seeUnowned ? "All indices" : "My indices", ...currentPath].map((folder, ix) =>
            folder == "" ? null : (
              <React.Fragment key={ix}>
                {ix == 0 ? null : <ChevronRight className="inline text-sm text-foreground/60" />}
                <span className="cursor-pointer" onClick={() => toFolder(currentPath.slice(0, ix))}>
                  {folder}
                </span>
              </React.Fragment>
            ),
          )}
        </h3>
        <div className={` Pagination flex items-center gap-3 ${allIndices?.length ? "" : "hidden"} `}>
          <Input
            className="w-36 border-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />
          {!canCreate ? null : (
            <Tooltip>
              <TooltipTrigger>
                <CreateIndex folder={currentPath.join("/")}>
                  <Button variant="default">
                    <FilePlus className="h-5 w-5" />
                  </Button>
                </CreateIndex>
              </TooltipTrigger>
              <TooltipContent>
                <span>Create a new Index</span>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={` ${seeUnowned ? "bg-secondary hover:bg-secondary/80" : ""} border-foreground/50 `}
                onClick={() => setSeeUnowned(!seeUnowned)}
              >
                <UserX className={`h-5 w-5 ${seeUnowned ? "text-secondary-foreground" : "text-foreground/50"}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Also show projects that you have no role in</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={` ${seeArchived ? "bg-secondary hover:bg-secondary/80" : ""} border-foreground/50 `}
                onClick={() => setSeeArchived(!seeArchived)}
              >
                <Trash2 className={`h-5 w-5 ${seeArchived ? "text-secondary-foreground" : "text-foreground/50"}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Show archived projects</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div></div>
      {/* Folders */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {visibleFolders.map((folder) => (
          <ProjectFolder key={folder} folder={folder} onClick={() => toFolder([...currentPath, folder])} />
        ))}
      </div>
      {/* Projects */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {visibleIndices?.map((index) => (
          <IndexCard key={index.id} index={index} folders={visibleFolders} toFolder={toFolder} />
        ))}
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

const IndexCard = ({
  index,
  folders,
  toFolder,
}: {
  index: AmcatIndex;
  folders: string[];
  toFolder: (folder: string[]) => void;
}) => {
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user } = useMiddlecat();
  const { mutateAsync } = useMutateIndex(user);
  if (user == null) return null;

  const style = index.image_url
    ? {
        backgroundImage: `url('${index.image_url}')`,
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "center",
        backgroundSize: "cover",
        backgroundPositionY: "center",
      }
    : {};

  function handleArchive(e: React.MouseEvent) {
    e.preventDefault();
    mutateAsync({ id: index.id, archive: !index.archived }).then(() => setIsDropdownOpen(false));
  }
  function doMoveToFolder(folder: string) {
    const newFolder =
      folder === ".."
        ? index.folder?.split("/").slice(0, -1).join("/")
        : index.folder
          ? `${index.folder}/${folder}`
          : folder;
    mutateAsync({ id: index.id, folder: newFolder }).then(() => {
      setIsDropdownOpen(false);
      setIsNewFolderDialogOpen(false);
      toFolder(newFolder?.split("/") ?? []);
    });
  }
  function handleMoveToFolder(e: Event, folder: string) {
    e.preventDefault();
    doMoveToFolder(folder);
  }

  function handleCreateNewFolder(e: React.MouseEvent) {
    e.preventDefault();
    doMoveToFolder(newFolderName);
  }

  return (
    <Link href={`/indices/${index.id}/dashboard`}>
      <Card style={style} className="relative h-40 overflow-hidden bg-primary/50">
        <CardHeader className="bg-background/70 p-3">
          <div className="flex items-start justify-between">
            <CardTitle className=" text-base">{index.name}</CardTitle>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleArchive}>
                  {index.archived ? <ArchiveRestore className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  <span>{index.archived ? "Re-activate" : "Archive"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="text-foreground" onSelect={(e) => e.preventDefault()}>
                  <Folder className="mr-2 h-4 w-4" />
                  <span>Move to folder:</span>
                </DropdownMenuItem>
                {index.folder && (
                  <DropdownMenuItem key={".."} onSelect={(e) => handleMoveToFolder(e, "..")}>
                    <CornerLeftUp className="ml-4 h-3 w-3" />
                    <span className="ml-1">
                      {index.folder.split("/")[index.folder.split("/").length - 2] || "Root"}
                    </span>
                  </DropdownMenuItem>
                )}
                {folders.map((folder) => (
                  <DropdownMenuItem key={folder} onSelect={(e) => handleMoveToFolder(e, folder)}>
                    <span className="ml-4">{folder}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      <span>To new folder</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Move {index.name} to new folder</DialogTitle>
                    </DialogHeader>
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                    />
                    <Button onClick={handleCreateNewFolder}>Create and Move</Button>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="line-clamp-2 h-8 text-xs">
            {index.description || <i>(No description)</i>}
          </CardDescription>
        </CardHeader>

        <CardFooter className="absolute bottom-0 right-0 z-10 p-2">
          <TooltipProvider>
            <div className="flex space-x-2">
              {index.archived && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash2 className="h-5 w-5 text-primary-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>This index is archived</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {index.user_role !== "NONE" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UserCheck className="h-5 w-5 text-primary-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>You have a role in this project</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </Link>
  );
};
