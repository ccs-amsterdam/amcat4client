"use client";

import { useIndex, useMutateIndex } from "@/api/index";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { AmcatIndex } from "@/interfaces";
import { useEffect, useState } from "react";
import { UpdateIndex } from "@/components/Index/UpdateIndex";

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
    <div className="flex flex-col justify-center">
      <div className="flex justify-end">
        <UpdateIndex index={index} />
      </div>
      <div className="prose-xl mt-[5vh] w-full max-w-7xl grid-cols-1 gap-5 p-5 ">
        <h2>{index.name}</h2>
        <p>{index.description}</p>
        <div className="grid grid-cols-[10rem,1fr]">
          <div className="font-bold">Guest role</div>
          <div className="text-primary">{index.guest_role}</div>
          <div className="font-bold">Own role</div>
          <div className="text-primary">{index.user_role}</div>
        </div>
      </div>
    </div>
  );
}
