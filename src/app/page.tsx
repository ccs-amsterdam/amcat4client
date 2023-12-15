"use client";

import { Input } from "@/components/ui/input";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useConfig } from "@/amcat/api/config";
import { AmcatServerConfig } from "@/amcat/interfaces";
import { Loading } from "@/components/ui/loading";
import { useRouter } from "next/navigation";

export default function Index({}: {}) {
  const [hosts, setHosts] = useLocalStorage<string[]>("hosts", []);
  const [host, setHost] = useState<string>("");
  const { data: config, isLoading, error, refetch } = useConfig(host, true);
  const router = useRouter();

  useEffect(() => {
    if (!config) return;
    router.push(`/host/${btoa(config.resource)}`);
  }, [config]);

  function onConnect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    refetch();
  }

  console.log(error);
  let errorMsg = error ? "Could not connect to server" : "";

  console.log(errorMsg);
  return (
    <div className="flex flex-auto  justify-center p-5">
      <div className=" prose w-80  animate-fade-in px-4 text-center">
        <h3>Connect to an AmCAT server</h3>
        <form className="flex flex-col gap-2" onSubmit={onConnect}>
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
          <Button>Connect</Button>
          {isLoading ? <Loading msg="Connecting..." /> : null}
          <span className="italic text-destructive">{errorMsg}</span>
        </form>
      </div>
    </div>
  );
}
