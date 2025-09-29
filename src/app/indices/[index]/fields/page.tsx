"use client";

import { useIndex } from "@/api/index";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { AmcatIndex } from "@/interfaces";
import FieldTable from "@/components/Fields/FieldTable";
import { useFields, useMutateFields } from "@/api/fields";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { parseAsStringEnum, useQueryState } from "next-usequerystate";
import Upload from "@/components/Upload/Upload";
import { useAmcatConfig } from "@/api/config";
import Multimedia from "@/components/Multimedia/Multimedia";

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

export default function Page({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const indexId = decodeURI(params.index);
  const { data: index, isLoading: loadingIndex, error } = useIndex(user, indexId);

  if (loading || loadingIndex) return <Loading />;
  if (!user || !index) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex w-full  flex-col gap-10">
      <Fields index={index} />
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
