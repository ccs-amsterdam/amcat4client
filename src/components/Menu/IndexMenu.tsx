"use client";

import { useAmcatConfig } from "@/api/config";
import { useIndex } from "@/api/index";
import useAmcatIndices from "@/api/indices";
import { useHasGlobalRole } from "@/api/userDetails";
import { AmcatIndex, AmcatIndexId } from "@/interfaces";
import { Book, ChevronDown, DatabaseZap, LayoutDashboard, Library, Menu, Settings } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CommandInput, Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import IndexRole from "./IndexRole";

const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

export default function IndexMenu() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const indexId = decodeURI(params?.index || "");
  const { data: index } = useIndex(user, indexId);
  const isServerAdmin = useHasGlobalRole(user, "ADMIN");
  if (loading || !user) return null;

  // if (!index) return <IndexSelector user={user} index={index} />;
  if (!index) return null;

  return (
    <>
      {/*<IndexSelector user={user} index={index} />*/}
      <NavLink index={index} path="dashboard" label="Dashboard" icon={<LayoutDashboard />} />
      <NavLink index={index} path="data" label="Data" icon={<DatabaseZap />} />
      <NavLink index={index} path="settings" label="Settings" icon={<Settings />} />
      <IndexRole />
    </>
  );
}

// function IndexSelector({ user, index }: { user: MiddlecatUser; index?: AmcatIndex }) {
//   const router = useRouter();
//   const path = usePathname();

//   const active = path?.startsWith("/indices") && !index;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger className={" h-full select-none gap-1 whitespace-nowrap border-primary  outline-none"}>
//         <div
//           className={`${
//             active ? "text-primary" : "text-foreground/80"
//           } hidden h-full select-none items-center gap-3 border-primary px-2 outline-none hover:bg-foreground/10 lg:flex lg:px-4`}
//         >
//           <Library />
//           <div className="max-w-[200px] overflow-hidden text-ellipsis">
//             {index?.name + "a lot more where that came from" || Index}
//           </div>
//           <ChevronDown className="h-4 w-4" />
//         </div>
//         <div className={`block lg:hidden ${active ? "text-primary" : "text-foreground/80"}`}>
//           <Library className="h-6 w-6" />
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="start" className=" min-w-[200px] border-[1px] border-foreground">
//         <DropdownMenuLabel>Indices</DropdownMenuLabel>
//         <DropdownMenuItem className="flex" onClick={() => router.push(`/indices`)}>
//           <Library className="mr-2 h-4 w-4" />
//           <span className="">Overview</span>
//         </DropdownMenuItem>
//         <SelectIndex user={user} index={index} />
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

function useCurrentPath() {
  const path = usePathname();
  if (!path) return "";
  const pathParts = path.split("/");
  return pathParts[pathParts.length - 1] || "";
}

function NavLink({ index, path, label, icon }: { index: AmcatIndex; path: string; label: string; icon: JSX.Element }) {
  const router = useRouter();
  const currentPath = useCurrentPath();
  const { data: serverConfig } = useAmcatConfig();
  const no_auth = serverConfig?.authorization === "no_auth";

  const active = path === currentPath;
  const href = `/indices/${index.id}/${path}`;
  const indexRole = index?.user_role || "NONE";
  const admin = no_auth || indexRole === "ADMIN";
  const writer = admin || indexRole === "WRITER";

  if (!admin) {
    if (path === "users" || path === "settings") return null;
  }
  if (!writer) {
    if (path === "users" || path === "settings" || path === "data") return null;
    if (path === "dashboard" && active) return null;
  }

  return (
    <button
      onClick={() => router.push(href)}
      className={`${
        active ? "text-primary" : "text-foreground/80"
      } flex h-full select-none items-center gap-3 border-primary px-2 outline-none hover:bg-foreground/10 lg:px-4`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

function SelectIndex({ user, index }: { user: MiddlecatUser; index?: AmcatIndex }) {
  const { data: indices } = useAmcatIndices(user);
  const router = useRouter();

  function onSelectIndex(index: string) {
    router.push(`/indices/${index}/dashboard`);
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="">
          <Book className="mr-2 h-4 w-4" />
          <span>Quick select</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="">
          <Command>
            <CommandInput placeholder="Filter indices" autoFocus={true} className="h-9" />
            <CommandList>
              <CommandEmpty>No index found</CommandEmpty>
              <CommandGroup>
                {indices?.map((ix) => {
                  if (ix.id === index?.id) return null;
                  if (ix.archived) return null;
                  return (
                    <CommandItem key={ix.id} value={ix.id} onSelect={(value) => onSelectIndex(value)}>
                      <span>{ix.name.replaceAll("_", " ")}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}
