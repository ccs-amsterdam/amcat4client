"use client";

import { useIndex, useMutateIndex } from "@/api/index";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { AmcatIndex } from "@/interfaces";
import { useEffect, useState } from "react";
import { UpdateIndex } from "@/components/Index/UpdateIndex";
import FieldTable from "@/components/Fields/FieldTable";
import { useFields, useMutateFields } from "@/api/fields";
import { useIndexUsers, useMutateIndexUser } from "@/api/indexUsers";
import UserRoleTable from "@/components/Users/UserRoleTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Edit } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "next-usequerystate";
import Upload from "@/components/Upload/Upload";

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

enum Tab {
  Index = "t1",
  Fields = "t2",
  Users = "t3",
  Upload = "t4",
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const indexId = decodeURI(params.index);
  const { data: index, isLoading: loadingIndex, error } = useIndex(user, indexId);
  const [tab, setTab] = useQueryState("tab", parseAsStringEnum<Tab>(Object.values(Tab)).withDefault(Tab.Index));

  if (loading || loadingIndex) return <Loading />;
  if (!user || !index) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex w-full  flex-col gap-10">
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="flex min-h-[500px] w-full flex-col">
        <TabsList className="mb-12">
          {Object.keys(Tab).map((tab) => {
            const tabValue = Tab[tab as keyof typeof Tab];
            return (
              <TabsTrigger key={tabValue} value={tabValue}>
                {tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="mx-auto w-full max-w-6xl">
          <TabsContent value={Tab.Index}>
            <Settings user={user} index={index} />
          </TabsContent>
          <TabsContent value={Tab.Fields}>
            <Fields index={index} />
          </TabsContent>
          <TabsContent value={Tab.Users}>
            <Users index={index} />
          </TabsContent>
          <TabsContent value={Tab.Upload}>
            <Upload indexId={index.id} user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Settings({ user, index }: { user: MiddlecatUser; index: AmcatIndex }) {
  const { mutate } = useMutateIndex(user);

  return (
    <div className="grid grid-cols-1 items-start justify-between gap-10">
      <div>
        <div className="mb-3 flex items-center gap-5 md:justify-between">
          <h2 className="mb-0 mt-0 break-all text-[clamp(1.2rem,5vw,2rem)]">{index.name}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={!index.archived ? "destructive" : "default"}
              onClick={() => {
                if (mutate) {
                  mutate({ id: index.id, action: "update", archive: !index.archived });
                }
              }}
            >
              {!!index.archived ? "Unarchive" : "Archive"}
            </Button>
            <UpdateIndex index={index}>
              <Button variant="ghost" className="flex gap-3">
                <Edit className="h-7 w-7" />
                <div className="hidden text-xl md:block">Edit</div>
              </Button>
            </UpdateIndex>
          </div>
        </div>
        <p className=" mt-0 break-all text-[clamp(0.8rem,3.5vw,1.4rem)]">{index.description}</p>
      </div>
      <div className="grid grid-cols-[auto,1fr] gap-x-5 text-lg   ">
        <div className="font-bold">Guest role</div>
        <div className="text-primary">{index.guest_role}</div>
        <div className="font-bold">Own role</div>
        <div className=" text-primary">{index.user_role}</div>
      </div>
      <div className={`${index.archived ? "" : "hidden"}`}>
        <p className="w-max rounded border border-destructive p-2 text-destructive">
          This project was archived on {index.archived?.split(".")[0]}
        </p>
      </div>
    </div>
  );
}

function Fields({ index }: { index: AmcatIndex }) {
  const { user, loading } = useMiddlecat();
  const { data: fields, isLoading: loadingFields } = useFields(user, index.id);
  const { mutate } = useMutateFields(user, index.id);

  if (loading || loadingFields) return <Loading />;

  const ownRole = index?.user_role;
  if (!user || !ownRole || !mutate) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;
  if (ownRole !== "ADMIN" && ownRole !== "WRITER")
    return <ErrorMsg type="Not Allowed">Need to have the WRITER or ADMIN role to edit index fields</ErrorMsg>;
  return <FieldTable fields={fields || []} mutate={(action, fields) => mutate({ action, fields })} />;
}

function Users({ index }: { index: AmcatIndex }) {
  const { user, loading } = useMiddlecat();
  const { data: users, isLoading: loadingUsers } = useIndexUsers(user, index.id);
  const mutate = useMutateIndexUser(user, index.id);

  if (loading || loadingUsers) return <Loading />;

  const ownRole = index?.user_role;
  async function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutate.mutateAsync({ email, role, action }).catch(console.error);
  }

  if (!user || !ownRole || !users || !changeRole) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex justify-center">
      <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} roles={roles} />
    </div>
  );
}
