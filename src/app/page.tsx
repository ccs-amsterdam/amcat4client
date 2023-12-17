"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAmcatConfig } from "@/amcat/api/config";
import { useRouter } from "next/navigation";
import { abbreviateHostname } from "@/lib/urlHost";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { X } from "lucide-react";

export default function Index({}: {}) {
  const [host, setHost] = useState<string>("");
  const [hostInput, setHostInput] = useState<string>("");
  const { user, loading } = useMiddlecat();
  const { data: config, isLoading, error, refetch } = useAmcatConfig(host);
  const router = useRouter();

  useEffect(() => {
    if (config) router.push(`/host/${abbreviateHostname(config.resource)}`);
  }, [user, config]);

  useEffect(() => {
    if (user?.resource) setHostInput(user.resource);
  }, [user]);

  function onClear(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setHostInput("");
  }
  function onConnect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHost(hostInput);
  }

  if (loading)
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
            <div className="relative">
              <Input
                className="w-full"
                value={hostInput}
                onChange={(e) => setHostInput(e.target.value)}
                type="url"
                name="url"
                pattern="https?://.*"
                required
                placeholder="https://some-amcat-server.anywhere"
              />

              <button onClick={onClear} className=" absolute right-0 top-0 px-2 py-2">
                <X color="grey" className="h-6 w-6" />
              </button>
            </div>
            <Button>{isLoading ? "Connecting..." : "Connect"}</Button>
            <span className="text-sm italic text-destructive">{error ? "Could not connect to server" : ""}</span>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
