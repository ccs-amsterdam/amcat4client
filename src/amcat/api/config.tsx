import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";

const configSchema = z.object({
  middlecat_url: z.string().url(),
  authorization: z.union([
    z.literal("allow_guests"),
    z.literal("no_auth"),
    z.literal("allow_authenticated_guests"),
    z.literal("authorized_users_only"),
  ]),
  resource: z.string().url(),
});

export type AmcatConfig = z.infer<typeof configSchema>;

export function useAmcatConfig(host: string | undefined, controlled?: boolean) {
  return useQuery({
    queryKey: ["config", host],
    queryFn: () => getAmcatConfig(host),
    enabled: !!host && !controlled,
  });
}

export async function getAmcatConfig(host: string | undefined) {
  if (!host) return undefined;
  const res = await axios.get(`${host}/config`);
  return configSchema.parse(res.data);
}
