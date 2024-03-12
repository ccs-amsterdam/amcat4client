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

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const indexId = decodeURI(params.index);
  const { data: index, isLoading: loadingIndex, error } = useIndex(user, indexId);

  // function onDelete() {
  //   if (!index) return;
  //   mutateIndex({ id: index.id, action: "delete" });
  //   router.push("/");
  // }

  // TODO: SOMEHOW INVALIDATION DOESN'T WORK IN UPDATEINDEX

  if (loading || loadingIndex) return <Loading />;
  if (!user || !index) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex max-w-7xl flex-col gap-10">
      <Settings index={index} />
      <Fields index={index} />
    </div>
  );
}

function Settings({ index }: { index: AmcatIndex }) {
  return (
    <div className="grid grid-cols-1 items-start justify-between gap-5 md:grid-cols-[1fr,auto]">
      <div>
        <div className="flex gap-5">
          <h2 className="mb-0 mt-0 break-all text-[clamp(1.2rem,5vw,2rem)]">{index.name}</h2>
          <UpdateIndex index={index} />
        </div>
        <p className=" mt-0 break-all text-[clamp(0.8rem,3.5vw,1.4rem)]">{index.description}</p>
      </div>
      <div className="grid grid-cols-[auto,1fr] gap-x-5 text-base   md:mt-2 md:grid-cols-[1fr,auto] md:text-right">
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
