"use client";

import { useIndex } from "@/api/index";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { ErrorMsg } from "@/components/ui/error-message";

import { useFields, useMutateFields } from "@/api/fields";
import FieldTable from "@/components/Fields/FieldTable";

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const indexId = decodeURI(params.index);
  const { data: fields, isLoading: loadingFields } = useFields(user, indexId);
  const { data: index, isLoading: loadingIndex } = useIndex(user, indexId);
  const { mutate } = useMutateFields(user, indexId);

  if (loading || loadingIndex || loadingFields) return <Loading />;

  const ownRole = index?.user_role;
  if (!user || !ownRole || !mutate) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;
  if (ownRole !== "ADMIN" && ownRole !== "WRITER")
    return <ErrorMsg type="Not Allowed">Need to have the WRITER or ADMIN role to edit index fields</ErrorMsg>;

  return (
    <div className="flex justify-center">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-5 p-0 md:grid-cols-[1fr,20rem] md:p-5">
        <div>
          <h3 className="text-lg font-bold leading-10">Fields</h3>
          <FieldTable fields={fields || []} mutate={(action, fields) => mutate({ action, fields })} />
        </div>
      </div>
    </div>
  );
}
