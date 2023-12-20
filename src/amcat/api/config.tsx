import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { amcatConfigSchema } from "@/amcat/schemas";

export function useAmcatConfig() {
  return useQuery({
    queryKey: ["config"],
    queryFn: () => getAmcatConfig(),
  });
}

export async function getAmcatConfig() {
  const host = process.env.NEXT_PUBLIC_AMCAT_SERVER;
  const res = await axios.get(`${host}/config`, { timeout: 3000 });
  return amcatConfigSchema.parse(res.data);
}
