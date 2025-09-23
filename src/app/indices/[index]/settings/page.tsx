"use client";

import { useAmcatConfig } from "@/api/config";
import { useIndex, useMutateIndex } from "@/api/index";
import { useIndexUsers, useMutateIndexUser } from "@/api/indexUsers";
import { ContactInfo } from "@/components/Index/ContactInfo";
import { UpdateIndex } from "@/components/Index/UpdateIndex";
import UserRoleTable from "@/components/Users/UserRoleTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmcatIndex, AmcatUserRole } from "@/interfaces";
import { TabsContent } from "@radix-ui/react-tabs";
import { Edit, Trash2 } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { parseAsStringEnum, useQueryState } from "next-usequerystate";
import { useState } from "react";

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

enum Tab {
  Settings = "settings",
  Users = "users",
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const indexId = decodeURI(params.index);
  const { data: index, isLoading: loadingIndex, error } = useIndex(user, indexId);
  const [tab, setTab] = useQueryState("tab", parseAsStringEnum<Tab>(Object.values(Tab)).withDefault(Tab.Settings));

  if (loading || loadingIndex) return <Loading />;
  if (!user || !index) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex w-full  flex-col gap-10">
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="flex min-h-[500px] w-full flex-col">
        <TabsList className="mb-12 overflow-x-auto">
          {Object.keys(Tab).map((tab) => {
            const tabValue = Tab[tab as keyof typeof Tab];
            return (
              <TabsTrigger key={tabValue} value={tabValue}>
                {tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="mx-auto w-full ">
          <TabsContent value={Tab.Settings}>
            <Settings user={user} index={index} />
          </TabsContent>
          <TabsContent value={Tab.Users}>
            <Users index={index} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Settings({ user, index }: { user: MiddlecatUser; index: AmcatIndex }) {
  const { mutate } = useMutateIndex(user);
  const [archiveOpen, setArchiveOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 items-start justify-between gap-10 p-3">
      <div>
        <div className="mb-3 flex items-center gap-5 md:justify-between">
          <h2 className="mb-0 mt-0 break-all text-[clamp(1.2rem,5vw,2rem)]">{index.name}</h2>
          <div className="flex items-center gap-2">
            <Popover open={archiveOpen} onOpenChange={setArchiveOpen}>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => setArchiveOpen(!archiveOpen)}
                  variant={!index.archived ? "outline" : "default"}
                  className="flex gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  {!!index.archived ? "Unarchive" : "Archive"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-3">
                <p>Are you sure you want to {!!index.archived ? "unarchive" : "archive"} this index?</p>
                <Button
                  onClick={() => {
                    if (mutate) {
                      mutate({ id: index.id, archive: !index.archived });
                    }
                    setArchiveOpen(false);
                  }}
                >
                  Yes
                </Button>
              </PopoverContent>
            </Popover>
            <UpdateIndex index={index}>
              <Button variant="ghost" className="flex gap-3">
                <Edit className="h-7 w-7" />
                <div className="hidden text-xl md:block">Edit</div>
              </Button>
            </UpdateIndex>
          </div>
        </div>
        <p className=" mt-0 break-all text-[clamp(0.8rem,3.5vw,1.4rem)]">
          {index.description || <i className="text-sm text-foreground/60">(No description)</i>}
        </p>
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-x-6 text-lg   ">
        <div className="font-bold">Guest role</div>
        <div className="text-primary">{index.guest_role}</div>
        <div className="font-bold">Own role</div>
        <div className=" text-primary">{index.user_role}</div>
        <div className="font-bold">Folder</div>
        <div className=" text-primary">{index.folder}</div>
        <div className="font-bold">Image</div>
        <div className=" text-primary">{index.image_url}</div>
        <div className="font-bold">Contact</div>
      </div>
      <div>
        <div className="prose w-max rounded-md bg-primary/10 px-6 py-2 dark:prose-invert">
          <h4 className="text-foreground/60">Contact information</h4>
          <ContactInfo contact={index.contact} />
        </div>
      </div>
      <div className={`${index.archived ? "" : "hidden"}`}>
        <p className="w-max rounded border border-destructive p-2 text-destructive">
          This project was archived on {index.archived?.split(".")[0]}
        </p>
      </div>
    </div>
  );
}

function Users({ index }: { index: AmcatIndex }) {
  const { user, loading } = useMiddlecat();
  const { data: users, isLoading: loadingUsers } = useIndexUsers(user, index.id);
  const { mutateAsync } = useMutateIndexUser(user, index.id);
  const { mutate: mutateIndex } = useMutateIndex(user);
  const { data: config } = useAmcatConfig();

  if (loading || loadingUsers) return <Loading />;

  const ownRole = config?.authorization === "no_auth" ? "ADMIN" : index?.user_role;

  async function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutateAsync({ email, role, action }).catch(console.error);
  }

  if (!user || !ownRole || !users || !changeRole) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="grid grid-cols-1 gap-6 p-3 lg:grid-cols-[1fr,19rem]">
      <div className="w-full max-w-4xl">
        <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} roles={roles} />
      </div>
      <div className="ml-auto flex h-max items-center gap-5 ">
        <h3 className="text-xl">Guest role</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex gap-3">
              <div>{index.guest_role}</div>
              <Edit className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-2">
              {["NONE", "METAREADER", "READER", "WRITER"].map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => {
                    mutateIndex({ id: index.id, guest_role: role as AmcatUserRole });
                  }}
                >
                  {role}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
9;
