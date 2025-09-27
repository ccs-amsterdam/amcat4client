"use client";

import { useDeleteIndex, useHasIndexRole, useMutateIndex } from "@/api";
import { useAmcatConfig } from "@/api/config";
import useAmcatIndices from "@/api/indices";
import { useHasGlobalRole } from "@/api/userDetails";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { AmcatIndex } from "@/interfaces";
import {
  Archive,
  ArchiveRestore,
  ArchiveX,
  CornerLeftUp,
  Filter,
  Folder,
  FolderPlus,
  LogInIcon,
  MoreVertical,
  Trash2,
  Undo,
  UserCheck,
} from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import { useQueryState } from "next-usequerystate";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { ActivateConfirm, useConfirm } from "../ui/confirm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ErrorMsg } from "../ui/error-message";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { CreateIndex } from "./CreateIndex";

interface Folder {
  folders: Map<string, Folder>;
  indices: AmcatIndex[];
}

export function SelectIndex() {
  const params = useSearchParams();
  const { user, loading: loadingUser } = useMiddlecat();
  const { data: allIndices, isLoading: loadingIndices } = useAmcatIndices(user);
  const [currentPath, setCurrentPath] = useQueryState("folder");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showPublic, setShowPublic] = useState(!user?.authenticated);
  const [visibleIndices, setVisibleIndices] = useState<AmcatIndex[]>([]);
  const [visibleFolders, setVisibleFolders] = useState<string[]>([]);
  const canCreate = useHasGlobalRole(user, "WRITER");

  const [path, setPath] = useState<string | null>(null);

  const myIndices = useMemo(() => {
    if (!allIndices) return undefined;
    return allIndices.filter((ix) => {
      if (!showPublic && ix.user_role === "NONE" && ix.guest_role === "NONE") return false;
      if (!showArchived && ix.archived) return false;
      return true;
    });
  }, [allIndices, showPublic, showArchived]);

  useEffect(() => {
    function setVisible() {
      if (!myIndices) return;

      const filtered = myIndices.filter((index) => {
        if (search) {
          if (index.name.toLowerCase().includes(search.toLowerCase())) return true;
          if (index.id.toLowerCase().includes(search.toLowerCase())) return true;
          return false;
        }
        return true;
      });

      let prefix = currentPath?.replace(/^\/|\/$/, "") ?? "";
      const visible = filtered.filter((index) => (index.folder ?? "").startsWith(prefix));

      const folderSet = new Set<string>();
      filtered.forEach((ix) => {
        if (!ix.folder) return;
        const path = ix.folder.split("/");
        const head = path.pop();
        if (head == null || path.join("/") !== prefix) return;
        folderSet.add(head);
      });

      setPath(prefix);
      setVisibleIndices(visible.sort((a, b) => (a.folder + a.name).localeCompare(b.folder + b.name)));
      setVisibleFolders([...folderSet]);
    }

    const timeout = setTimeout(setVisible, 200);
    return () => clearTimeout(timeout);
  }, [myIndices, search, currentPath, showArchived, showPublic]);

  if (loadingUser || loadingIndices)
    return (
      <div className="mt-[20vh]">
        <Loading />
      </div>
    );

  function updatePath(path: string | null) {
    // setVisibleFolders([]);
    // setVisibleIndices([]);
    setCurrentPath(path);
  }
  function setFolder(folder: string[]) {
    updatePath(folder.join("/"));
  }
  function appendFolder(add: string) {
    updatePath(currentPath ? currentPath + "/" + add : add);
  }

  if (user && user.authenticated && showPublic && allIndices?.length === 0) return <NoIndicesMessage />;

  return (
    <div>
      <div className="mb-8 flex flex-col items-start gap-2">
        <div className="flex w-full items-center justify-between">
          <h3 className="m-0">Index overview</h3>
        </div>
        <div className={` Pagination ml-auto flex items-center gap-3  `}>
          <Popover>
            <PopoverTrigger>
              <Filter />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2">
              <div className={`flex  items-center gap-3`}>
                <Switch className="size-3" id="seePublic" checked={showPublic} onCheckedChange={setShowPublic} />
                <Label htmlFor="seePublic">show public indices</Label>
              </div>
              <div className={`flex  items-center gap-3`}>
                <Switch className="size-3" id="seeArchived" checked={showArchived} onCheckedChange={setShowArchived} />
                <Label htmlFor="seeArchived">show archived</Label>
              </div>
            </PopoverContent>
          </Popover>
          <Input
            className="w-44 border-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />
          <CreateIndex folder={currentPath ?? undefined} request={!canCreate} />
        </div>
      </div>

      <div>
        <FolderBreadcrumbs currentPath={path} toFolder={updatePath} />
      </div>

      <div className="grid grid-cols-[min(30vw,200px),1fr] gap-6">
        <div className="">
          {!!path ? (
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3"
              onClick={() => setFolder((path?.split("/") ?? []).slice(0, -1))}
            >
              <Undo className="h-5 w-5" />
              Return
            </Button>
          ) : null}
          {visibleFolders.map((folder) => (
            <ProjectFolder key={folder} folder={folder} onClick={() => appendFolder(folder)} />
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,240px))] gap-4">
          {visibleIndices?.map((index) => (
            <IndexCard key={index.id} index={index} folders={visibleFolders} toFolder={setCurrentPath} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FolderBreadcrumbs({
  currentPath,
  toFolder,
}: {
  currentPath: string | null;
  toFolder: (folder: string | null) => void;
}) {
  const pathArray = currentPath ? currentPath.split("/").filter((p) => p) : [];
  return (
    <Breadcrumb className="">
      <BreadcrumbList className="gap-0 pl-0  sm:gap-0">
        <BreadcrumbItem>
          <Button className="text-base" variant="ghost" onClick={() => toFolder(null)}>
            Root
          </Button>
        </BreadcrumbItem>
        {pathArray.map((folder, i) => (
          <Fragment key={i + folder}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Button
                className="text-base"
                variant="ghost"
                onClick={() => toFolder(pathArray.slice(0, i + 1).join("/"))}
              >
                {folder || "Root"}
              </Button>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const ProjectFolder = ({ folder, onClick }: { folder: string; onClick: () => void }) => (
  <Button variant="ghost" className="flex items-center justify-start gap-3" onClick={onClick}>
    <Folder className="h-5 w-5" />
    <span className="max-w-16 overflow-hidden text-ellipsis text-nowrap text-xs md:max-w-32 md:text-sm" title={folder}>
      {folder}
    </span>
  </Button>
);

const IndexCard = ({
  index,
  folders,
  toFolder,
}: {
  index: AmcatIndex;
  folders: string[];
  toFolder: (folder: string) => void;
}) => {
  const { activate, confirmDialog } = useConfirm();
  const { user } = useMiddlecat();
  if (user == null) return null;

  const indexPath = index.folder ? index.folder.split("/") : [];

  const style = index.image_url
    ? {
        backgroundImage: `url('${index.image_url}')`,
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "center",
        backgroundSize: "cover",
        backgroundPositionY: "center",
      }
    : {};

  return (
    <>
      {confirmDialog}
      <Link href={`/indices/${index.id}/dashboard`}>
        <Card style={style} className="relative h-40 overflow-hidden bg-primary/50">
          <CardHeader className="bg-background/70 p-3">
            <div className="flex items-start justify-between">
              <CardTitle className=" text-base">{index.name}</CardTitle>
              <IndexDropdownMenu index={index} folders={folders} toFolder={toFolder} activateConfirm={activate} />
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

function IndexDropdownMenu({
  index,
  folders,
  toFolder,
  activateConfirm,
}: {
  index: AmcatIndex;
  folders: string[];
  toFolder: (folder: string) => void;
  activateConfirm: ActivateConfirm;
}) {
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user } = useMiddlecat();
  const { mutateAsync } = useMutateIndex(user);
  const { mutateAsync: deleteAsync } = useDeleteIndex(user);

  const isAdmin = useHasIndexRole(user, index.id, "ADMIN");
  const isWriter = useHasIndexRole(user, index.id, "WRITER");

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
      toFolder(newFolder || "");
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

  if (!isWriter) return null;

  return (
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
              {index.archived ? <ArchiveRestore className="mr-2 h-4 w-4" /> : <ArchiveX className="mr-2 h-4 w-4" />}
              <span>{index.archived ? "Re-activate" : "Archive"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() =>
                activateConfirm(handleDelete, {
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
            <span className="ml-1">{index.folder.split("/")[index.folder.split("/").length - 2] || "Root"}</span>
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
              <DialogDescription>This will create a new folder and move the index to that folder</DialogDescription>
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
  );
}

function NoIndicesMessage({}: {}) {
  const { signIn } = useMiddlecat();
  const { data: config } = useAmcatConfig();

  return (
    <ErrorMsg type="No public indices">
      <p className="w-[500px] max-w-[95vw] text-center">
        There are no public indices on this server. Please sign-in to see if you have access to any indices. Signed in
        users can also request the creation of new indices.
      </p>
      <Button className="mx-auto flex items-center gap-2 pr-6" onClick={() => signIn()}>
        <LogInIcon className="mr-2 h-4 w-4" />
        Sign-in
      </Button>
    </ErrorMsg>
  );
}
