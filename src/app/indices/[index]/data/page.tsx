"use client";

import { useIndex, useMutateIndex } from "@/api/index";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { AmcatIndex, AmcatUserRole } from "@/interfaces";
import { useEffect, useState } from "react";
import { UpdateIndex } from "@/components/Index/UpdateIndex";
import FieldTable from "@/components/Fields/FieldTable";
import { useFields, useMutateFields } from "@/api/fields";
import { useIndexUsers, useMutateIndexUser } from "@/api/indexUsers";
import UserRoleTable from "@/components/Users/UserRoleTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Edit, Trash2 } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "next-usequerystate";
import Upload from "@/components/Upload/Upload";
import { Dialog } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { set } from "date-fns";
import { useAmcatConfig } from "@/api/config";
import Multimedia from "@/components/Multimedia/Multimedia";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Preprocessing from "@/components/Preprocessing/Preprocessing";

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

enum Tab {
  Fields = "fields",
  Upload = "upload",
  Multimedia = "multimedia",
  // Preprocessing = "preprocessing",
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const { data: serverConfig, isLoading: configLoading } = useAmcatConfig();
  const indexId = decodeURI(params.index);
  const { data: index, isLoading: loadingIndex, error } = useIndex(user, indexId);
  const [tab, setTab] = useQueryState("tab", parseAsStringEnum<Tab>(Object.values(Tab)).withDefault(Tab.Fields));

  if (loading || loadingIndex || configLoading) return <Loading />;
  if (!user || !index) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex w-full  flex-col gap-10">
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="flex min-h-[500px] w-full flex-col">
        <TabsList className="mb-12 overflow-x-auto">
          {Object.keys(Tab).map((tab) => {
            const disabled = tab === "Multimedia" && !serverConfig?.minio;
            const tabValue = Tab[tab as keyof typeof Tab];
            return (
              <TabsTrigger key={tabValue} value={tabValue} disabled={disabled}>
                {tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="mx-auto w-full ">
          <TabsContent value={Tab.Fields}>
            <Fields index={index} />
          </TabsContent>
          <TabsContent value={Tab.Upload}>
            <Upload indexId={index.id} user={user} />
          </TabsContent>
          <TabsContent value={Tab.Multimedia}>
            <Multimedia indexId={index.id} user={user} />
          </TabsContent>
          {/*<TabsContent value={Tab.Preprocessing}>
            <Preprocessing indexId={index.id} user={user} />
          </TabsContent>*/}
        </div>
      </Tabs>
    </div>
  );
}

function Fields({ index }: { index: AmcatIndex }) {
  const { user, loading } = useMiddlecat();
  const { data: fields, isLoading: loadingFields } = useFields(user, index.id);
  const { mutate } = useMutateFields(user, index.id);
  const { data: config } = useAmcatConfig();

  if (loading || loadingFields) return <Loading />;

  const ownRole = config?.authorization === "no_auth" ? "ADMIN" : index?.user_role;
  if (!user || !ownRole || !mutate) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;
  if (ownRole !== "ADMIN" && ownRole !== "WRITER")
    return <ErrorMsg type="Not Allowed">Need to have the WRITER or ADMIN role to edit index fields</ErrorMsg>;

  return (
    <div className="p-3">
      <FieldTable fields={fields || []} mutate={(action, fields) => mutate({ action, fields })} />
    </div>
  );
}
