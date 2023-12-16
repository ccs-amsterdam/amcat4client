"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAmcatConfig } from "@/amcat/api/config";
import { useRouter } from "next/navigation";
import { abbreviateHostname } from "@/lib/urlHost";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

export default function Index({}: {}) {
  const [host, setHost] = useState<string>("");
  const { user, loading } = useMiddlecat();
  const { data: config, isLoading, error, refetch } = useAmcatConfig(host, true);

  const router = useRouter();

  useEffect(() => {
    if (user) router.push(`/host/${abbreviateHostname(user.resource)}`);
    if (config) router.push(`/host/${abbreviateHostname(config.resource)}`);
  }, [user, config]);

  function onConnect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    refetch();
  }

  if (loading || user)
    return (
      <div className="mt-[20vh]">
        <Loading />
      </div>
    );

  return (
    <div className="mt-[20vh] flex h-full flex-auto flex-col items-center p-5">
      <div className="prose-lg w-96 animate-fade-in px-4 text-center">
        <h3>Connect to an AmCAT server</h3>
        <form onSubmit={onConnect}>
          <fieldset className="flex flex-col gap-2" disabled={isLoading}>
            <Input
              className="w-full"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              type="url"
              name="url"
              pattern="https?://.*"
              required
              placeholder="https://some-amcat-server.anywhere"
            />
            <Button>{isLoading ? "Connecting..." : "Connect"}</Button>
            <span className="text-sm italic text-destructive">{error ? "Could not connect to server" : ""}</span>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
