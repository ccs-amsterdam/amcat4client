"use client";

import { useIndex } from "@/api/index";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

const roles = ["METAREADER", "READER", "WRITER", "ADMIN"];

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const { data: index, isLoading: loadingIndex, error } = useIndex(user, params.index);
  // const { mutate: mutateIndex } = useMutateIndex(user, index?.name);
  // function onDelete() {
  //   if (!index) return;
  //   mutateIndex({ id: index.id, action: "delete" });
  //   router.push("/");
  // }

  if (loading || loadingIndex) return <Loading />;

  if (!user || !index) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex justify-center">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-5 p-5 md:grid-cols-[1fr,20rem]">
        <div>Here add form for changing index name, description, and stuff. And also delete modal</div>
      </div>
    </div>
  );
}
