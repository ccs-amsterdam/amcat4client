import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { amcatConfigSchema } from "@/amcat/schemas";

export function useAmcatConfig(host: string | undefined) {
  return useQuery({
    queryKey: ["config", host],
    queryFn: () => getAmcatConfig(host),
    enabled: !!host,
  });
}

export async function getAmcatConfig(host: string | undefined) {
  if (!host) return undefined;
  const res = await axios.get(`${host}/config`, { timeout: 3000 });
  return amcatConfigSchema.parse(res.data);
}
