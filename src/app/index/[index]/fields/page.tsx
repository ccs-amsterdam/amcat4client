"use client";

import { useIndex } from "@/api/index";
import { useIndexUsers, useMutateIndexUser } from "@/api/indexUsers";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { ErrorMsg } from "@/components/ui/error-message";
import UserRoleTable from "@/components/Users/UserRoleTable";
import CreateUserForm from "@/components/Users/CreateUserForm";
import { useFields, useMutateFields } from "@/api/fields";
import { AmcatField } from "@/interfaces";
import FieldTable from "@/components/Fields/FieldTable";

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const { data: fields, isLoading: loadingFields } = useFields(user, params.index);
  const { data: index, isLoading: loadingIndex } = useIndex(user, params.index);
  const { mutate } = useMutateFields(user, params.index);

  if (loading || loadingIndex || loadingFields) return <Loading />;

  const ownRole = index?.user_role;
  if (!user || !ownRole || !mutate) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;
  if (ownRole !== "ADMIN" && ownRole !== "WRITER")
    return <ErrorMsg type="Not Allowed">Need to have the WRITER or ADMIN role to edit index fields</ErrorMsg>;

  return (
    <div className="flex justify-center">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-5 p-5 md:grid-cols-[1fr,20rem]">
        <div>
          <h3 className="text-lg font-bold leading-10">Fields</h3>
          <FieldTable fields={fields || []} mutate={mutate} />
        </div>
      </div>
    </div>
  );
}
