"use client";

import { useDeleteIndex, useHasIndexRole, useMutateIndex } from "@/api";
import useAmcatIndices from "@/api/indices";
import { useHasGlobalRole } from "@/api/userDetails";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { AmcatIndex } from "@/interfaces";
import { DialogDescription } from "@radix-ui/react-dialog";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  Archive,
  ArchiveRestore,
  ArchiveX,
  ChevronRight,
  CornerLeftUp,
  FilePlus,
  Filter,
  Folder,
  FolderPlus,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useConfirm } from "../ui/confirm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { CreateIndex } from "./CreateIndex";
import { Toggle } from "../ui/toggle";

interface Folder {
  folders: Map<string, Folder>;
  indices: AmcatIndex[];
}

export function SelectIndex() {
  const params = useSearchParams();
  const { user, loading } = useMiddlecat();
  const { data: allIndices, isLoading: loadingIndices } = useAmcatIndices(user);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [seeArchived, setSeeArchived] = useState(false);
  const [seeUnowned, setSeeUnowned] = useState(!user?.authenticated);
  const [visibleIndices, setVisibleIndices] = useState<AmcatIndex[]>([]);
  const [visibleFolders, setVisibleFolders] = useState<string[]>([]);
  const canCreate = useHasGlobalRole(user, "WRITER");
  const isServerAdmin = useHasGlobalRole(user, "ADMIN");

  //const [isListView, setIsListView] = useState(false);
  useEffect(() => {
    setCurrentPath(params?.get("folder")?.split("/") ?? []);
  }, [params]);

  const myIndices = useMemo(() => {
    if (!allIndices) return undefined;
    return allIndices.filter((ix) => {
      if (!seeUnowned && ix.user_role === "NONE" && ix.guest_role === "NONE") return false;
      if (!seeArchived && ix.archived) return false;
      return true;
    });
  }, [allIndices, seeUnowned, seeArchived]);

  useEffect(() => {
    function setVisible() {
      if (!myIndices) return;
      const prefix = currentPath.join("/").replace(/^\/|\/$/, "");
      const filtered = myIndices.filter((index) => {
        if ((index.folder ?? "") !== prefix) return false;
        if (search) {
          if (index.name.toLowerCase().includes(search.toLowerCase())) return true;
          if (index.id.toLowerCase().includes(search.toLowerCase())) return true;
          return false;
        }
        return true;
      });

      const folderSet = new Set<string>();
      filtered.forEach((ix) => {
        if (!ix.folder) return;
        const path = ix.folder.split("/");
        const head = path.pop();
        if (head == null || path.join("/") !== prefix) return;
        folderSet.add(head);
      });

      setVisibleIndices(filtered);
      setVisibleFolders([...folderSet]);
    }

    const timeout = setTimeout(setVisible, 200);
    return () => clearTimeout(timeout);
  }, [myIndices, search, currentPath, seeArchived, seeUnowned]);

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
      <div className="mb-8 flex flex-col items-start gap-2">
        <div className="flex w-full items-center justify-between">
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
          <CreateIndex folder={currentPath.join("/")} request={true} />
        </div>
        <div className={` Pagination mr-auto flex items-center gap-3  `}>
          <Input
            className="w-44 border-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />
          {/*<Search className="ml-2 h-6 w-6 text-foreground/50" />*/}

          {/*<DropdownMenu>
            <DropdownMenuTrigger>
              <Filter className="ml-2 h-6 w-6 text-foreground/50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Role</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>*/}

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
          {/*<Tooltip>
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
          </Tooltip>*/}
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
  const { activate, confirmDialog } = useConfirm();

  const { user } = useMiddlecat();
  const { mutateAsync } = useMutateIndex(user);
  const { mutateAsync: deleteAsync } = useDeleteIndex(user);

  const isAdmin = useHasIndexRole(user, index.id, "ADMIN");
  const isWriter = useHasIndexRole(user, index.id, "WRITER");
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

  function handleDelete() {
    deleteAsync(index.id);
  }

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
    <>
      {confirmDialog}
      <Link href={`/indices/${index.id}/dashboard`}>
        <Card style={style} className="relative h-40 overflow-hidden bg-primary/50">
          <CardHeader className="bg-background/70 p-3">
            <div className="flex items-start justify-between">
              <CardTitle className=" text-base">{index.name}</CardTitle>
              {!isWriter ? null : (
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    {!isAdmin ? null : (
                      <>
                        <DropdownMenuItem onClick={handleArchive}>
                          {index.archived ? (
                            <ArchiveRestore className="mr-2 h-4 w-4" />
                          ) : (
                            <ArchiveX className="mr-2 h-4 w-4" />
                          )}
                          <span>{index.archived ? "Re-activate" : "Archive"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            activate(handleDelete, {
                              description: `You are about to delete index ${index.name}. This cannot be undone!`,
                              challenge: index.id,
                              confirmText: `Delete index ${index.name}`,
                            })
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
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
                      <DialogDescription></DialogDescription>
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
                        <DialogDescription>
                          This will create a new folder and move the index to that folder
                        </DialogDescription>
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
              )}
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
                      <Archive className="h-5 w-5 text-primary-foreground" />
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
    </>
  );
};
