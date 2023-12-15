import { AmcatServerConfig } from "@/amcat/interfaces";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useConfig(host: string, controlled?: boolean) {
  return useQuery({
    queryKey: ["config", host],
    queryFn: () => getConfig(host),
    enabled: !!host && !controlled,
  });
}

export async function getConfig(host: string): AmcatServerConfig | undefined {
  const res = await axios.get(`${host}/config`);
  return res.data;
}
