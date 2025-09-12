import { AmcatConfig } from "@/interfaces";
import { amcatConfigSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMiddlecat } from "middlecat-react";

export function useAmcatConfig() {
  const { fixedResource: host } = useMiddlecat();
  return useQuery({
    queryKey: ["config"],
    queryFn: () => getAmcatConfig(host),
    staleTime: 1000 * 60 * 60 * 1,
  });
}

export async function getAmcatConfig(host?: string) {
  if (!host) return undefined;
  const res = await axios.get(`${host}/config`, { timeout: 3000 });
  const config: AmcatConfig = amcatConfigSchema.parse(res.data);
  return config;
}
