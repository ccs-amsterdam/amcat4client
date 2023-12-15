import { useQuery } from "@tanstack/react-query";
import { AmcatServerConfig, AmcatUser } from "@/amcat/interfaces";
import { AxiosResponse } from "axios";

export function useServerConfig(user?: AmcatUser) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["serverconfig", user?.email],
    queryFn: async () => getServerConfig(user),
  });

  const serverConfig: AmcatServerConfig | undefined = data || undefined;
  return { serverConfig, isLoading, error, refetch };
}

/** Get server config */
async function getServerConfig(user: AmcatUser | undefined) {
  if (!user) return;
  const res = await user.api.get(`/config`);
  const serverConfig: AmcatServerConfig = res.data;
  return serverConfig;
}
