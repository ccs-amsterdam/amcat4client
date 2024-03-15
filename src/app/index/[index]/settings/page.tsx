"use client";

import { useIndex, useMutateIndex } from "@/api/index";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
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

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

type Tabs = "index" | "fields" | "users";

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const indexId = decodeURI(params.index);
  const { data: index, isLoading: loadingIndex, error } = useIndex(user, indexId);
  const [tab, setTab] = useState<Tabs>("index");

  // TODO: SOMEHOW INVALIDATION DOESN'T WORK IN UPDATEINDEX

  if (loading || loadingIndex) return <Loading />;
  if (!user || !index) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex w-full  flex-col gap-10">
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tabs)} className="flex min-h-[500px] w-full flex-col">
        <TabsList className="mb-12">
          <TabsTrigger value="index" key="index">
            Index
          </TabsTrigger>
          <TabsTrigger value="fields" key="fields">
            Fields
          </TabsTrigger>
          <TabsTrigger value="users" key="users">
            Users
          </TabsTrigger>
        </TabsList>
        <div className="mx-auto w-full max-w-6xl">
          <TabsContent value="index">
            <Settings index={index} />
          </TabsContent>
          <TabsContent value="fields">
            <Fields index={index} />
          </TabsContent>
          <TabsContent value="users">
            <Users index={index} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Settings({ index }: { index: AmcatIndex }) {
  return (
    <div className="grid grid-cols-1 items-start justify-between gap-10">
      <div>
        <div className="mb-3 flex items-center gap-5 md:justify-between">
          <h2 className="mb-0 mt-0 break-all text-[clamp(1.2rem,5vw,2rem)]">{index.name}</h2>
          <UpdateIndex index={index}>
            <Button variant="ghost" className="flex gap-3">
              <Edit className="h-7 w-7" />
              <div className="hidden text-xl md:block">Edit</div>
            </Button>
          </UpdateIndex>
        </div>
        <p className=" mt-0 break-all text-[clamp(0.8rem,3.5vw,1.4rem)]">{index.description}</p>
      </div>
      <div className="grid grid-cols-[auto,1fr] gap-x-5 text-lg   ">
        <div className="font-bold">Guest role</div>
        <div className="text-primary">{index.guest_role}</div>
        <div className="font-bold">Own role</div>
        <div className=" text-primary">{index.user_role}</div>
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
