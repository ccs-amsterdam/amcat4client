import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { amcatConfigSchema } from "@/schemas";

export function useAmcatConfig() {
  return useQuery({
    queryKey: ["config"],
    queryFn: () => getAmcatConfig(),
    staleTime: 1000 * 60 * 60 * 1,
  });
}

export async function getAmcatConfig() {
  const host = process.env.NEXT_PUBLIC_AMCAT_SERVER;
  console.log(host);
  const res = await axios.get(`${host}/config`, { timeout: 3000 });
  return amcatConfigSchema.parse(res.data);
}
