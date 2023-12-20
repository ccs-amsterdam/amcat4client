"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

import Dashboard from "./Dashboard";

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading: loadingUser } = useMiddlecat();

  if (loadingUser || !user) return <Loading />;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl p-5">
        <Dashboard user={user} index={params.index} />
      </div>
    </div>
  );
}
