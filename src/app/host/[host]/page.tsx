"use client";

import { useUrlHost } from "@/lib/urlHost";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import useAmcatIndices from "@/amcat/api/indices";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Index() {
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const router = useRouter();
  const host = useUrlHost();
  console.log(host);
  const { user, loading } = useMiddlecat();
  const { data: indices, isLoading: loadingIndices } = useAmcatIndices(user);

  useEffect(() => {
    // if a person follows a link that requires authentication for a server, send them here
    // with a callback url. If they are authenticated, redirect them to the callback url
    if (!callback) return;
    if (user) router.push(callback);
  }, [user, callback]);

  if (loading)
    return (
      <div className="mt-[20vh]">
        <Loading />
      </div>
    );

  return (
    <div className="mt-[20vh] flex h-full flex-auto flex-col items-center p-5">
      <div className="prose-lg w-96 animate-fade-in px-4 text-center">
        <h3>Select an Index</h3>
      </div>
    </div>
  );
}
