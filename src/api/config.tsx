import { AmcatConfig } from "@/interfaces";
import { amcatConfigSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMiddlecat } from "middlecat-react";
import { useSearchParams } from "next/dist/client/components/navigation";

export function useAmcatConfig() {
  const params = useSearchParams();

  // This is a development feature to simulate different server auth modes without having to change them on the server
  const fakeAuthorization = params?.get("fake_authorization") || undefined;

  const { fixedResource: host } = useMiddlecat();
  return useQuery({
    queryKey: ["config"],
    queryFn: () => getAmcatConfig(host, fakeAuthorization),
    staleTime: 1000 * 60 * 60 * 1,
  });
}

export async function getAmcatConfig(host?: string, fakeAuthorization?: string) {
  if (!host) return undefined;
  const res = await axios.get(`${host}/config`, { timeout: 3000 });
  const config: AmcatConfig = amcatConfigSchema.parse(res.data);
  if (fakeAuthorization) config.authorization = amcatConfigSchema.shape.authorization.parse(fakeAuthorization);
  return config;
}
