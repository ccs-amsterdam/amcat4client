"use client";

import useAmcatIndices from "@/api/indices";
import { useHasGlobalRole } from "@/api/userDetails";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { AmcatIndex } from "@/interfaces";
import { Folder, FolderOpen, LogInIcon, Search, Settings2, Undo } from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import { useQueryState } from "next-usequerystate";
import { useEffect, useMemo, useState } from "react";
import { ErrorMsg } from "../ui/error-message";
import { InfoMsg } from "../ui/info-message";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import { CreateIndex } from "./CreateIndex";
import { FolderBreadcrumbs } from "./FolderBreadcrumbs";
import { IndexCard } from "./IndexCard";
import { PendingIndexRequests } from "./PendingIndexRequests";

interface Folder {
  folders: Map<string, Folder>;
  indices: AmcatIndex[];
}

export function SelectIndex() {
  const { user, loading: loadingUser } = useMiddlecat();
  const { data: allIndices, isLoading: loadingIndices } = useAmcatIndices(user);
  const [currentPath, setCurrentPath] = useQueryState("folder");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showPublic, setShowPublic] = useState(!user?.authenticated);
  const [indexMap, setIndexMap] = useState<Map<string, AmcatIndex[]>>(new Map());
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

      const indexMap = new Map<string, AmcatIndex[]>();
      indexMap.set("", []);

      filtered.forEach((ix) => {
        // remove double slashes and leading/trailing slashes
        const folder = (ix.folder || "").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");

        if (prefix && folder !== prefix && !folder.startsWith(prefix + "/")) return;

        // const head = path.pop() || "";
        const remainingPath = prefix ? folder.slice(prefix.length + 1) : folder;

        const head = remainingPath.split("/")[0] || "";
        if (!indexMap.has(head)) indexMap.set(head, []);
        indexMap.get(head)?.push(ix);
      });

      setPath(prefix);
      setIndexMap(indexMap);
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

  if (user && !user.authenticated && allIndices?.length === 0) return <NoPublicIndicesMessage />;
  const folderList = [...indexMap.keys()].filter((f) => f !== "");

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-8 flex flex-col items-start gap-2 md:flex-row">
        <div className="prose-xl mr-auto  flex items-center justify-between">
          <h3 className="">Indices</h3>
        </div>
        <CreateIndex folder={currentPath ?? undefined} request={!canCreate} />
        <PendingIndexRequests />
      </div>

      <div className="mb-3 flex items-center gap-6">
        <FolderBreadcrumbs currentPath={path} toFolder={updatePath} />
        <SearchAndFilter
          search={search}
          setSearch={setSearch}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
          showPublic={showPublic}
          setShowPublic={setShowPublic}
        />
      </div>

      <div className="grid grid-cols-[min(30vw,200px),1fr] gap-3">
        <div className="flex h-full min-h-[500px]  flex-col p-1 pl-0">
          <Button
            size="sm"
            variant="ghost"
            className={`${path ? "flex" : "hidden"}  h-8 items-center justify-start gap-3 px-1 text-foreground/50 `}
            onClick={() => setFolder((path?.split("/") ?? []).slice(0, -1))}
          >
            <Undo className="h-4 w-4" />
            back
          </Button>

          {folderList.map((folder) => (
            <ProjectFolder key={folder} folder={folder} onClick={() => appendFolder(folder)} />
          ))}
          {folderList?.length || path ? null : <div className="px-1 py-1 text-sm text-foreground/60">No folders</div>}
        </div>
        {indexMap.size === 0 ? (
          <NoResultsMessage cancreate={!!canCreate} issearching={search !== ""} />
        ) : (
          <div className="flex flex-col">
            <div className="mb-6 min-h-[36rem] rounded bg-foreground/5 p-3">
              {[...indexMap].map(([folder, indices]) => {
                if (search === "" && folder !== "") return null;
                if (indices.length === 0) return null;

                return (
                  <div key={folder} className="mb-6">
                    <div
                      className={`${folder === "" ? "hidden" : ""} mb-3 flex items-center gap-1  pt-1 text-sm text-foreground/60`}
                    >
                      search results inside
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex h-6 items-center gap-2"
                        onClick={() => appendFolder(folder)}
                      >
                        <Folder className="h-5 w-5" />
                        {folder}
                      </Button>
                      <div className={"flex-auto  border-b border-foreground/10"} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                      {indices.map((index) => (
                        <IndexCard key={index.id} index={index} folders={folderList} toFolder={setCurrentPath} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchAndFilter({
  search,
  setSearch,
  showArchived,
  setShowArchived,
  showPublic,
  setShowPublic,
}: {
  search: string;
  setSearch: (s: string) => void;
  showArchived: boolean;
  setShowArchived: (b: boolean) => void;
  showPublic: boolean;
  setShowPublic: (b: boolean) => void;
}) {
  return (
    <div className={`Pagination ml-auto flex select-none items-center gap-3  `}>
      <div className="relative flex items-center gap-2">
        <Search className="absolute left-1 h-5 w-5 text-foreground/20" />
        <Input
          className="w-44 rounded-none border-0  border-b pl-9 focus-visible:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
      </div>
      <Popover>
        <PopoverTrigger>
          <Settings2 />
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
    </div>
  );
}

const ProjectFolder = ({ folder, onClick }: { folder: string; onClick: () => void }) => (
  <Button
    variant="ghost"
    size="sm"
    className="group flex h-8 min-h-0 items-center justify-start gap-3 px-1 py-1"
    onClick={onClick}
  >
    <Folder className={`h-4 w-4 group-hover:hidden`} />
    <FolderOpen className={`hidden h-4 w-4 group-hover:block`} />
    <span
      className="max-w-16 overflow-hidden text-ellipsis text-nowrap text-sm md:max-w-32 md:text-base"
      title={folder}
    >
      {folder}
    </span>
  </Button>
);

function NoPublicIndicesMessage({}: {}) {
  const { signIn } = useMiddlecat();

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
function NoResultsMessage({ cancreate, issearching }: { cancreate: boolean; issearching: boolean }) {
  return (
    <InfoMsg type="No indices">
      <p className="w-[500px] max-w-[95vw] text-center">
        {issearching
          ? "No indices match your search pattern. Try changing your search terms or filter options. "
          : "There are currently no indices that you have access to. "}
        {cancreate
          ? "To get started, create a new index using the 'create new (index)' button above"
          : "To get started, you can ask a server administrator to create a project for you using the 'Request new (index)' button above "}
      </p>
    </InfoMsg>
  );
}
