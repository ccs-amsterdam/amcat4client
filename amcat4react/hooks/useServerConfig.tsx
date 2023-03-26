import { useQuery, UseQueryResult } from "react-query";
import { getServerConfig } from "../Amcat";
import { AmcatServerConfig, AmcatUser } from "../interfaces";

export function useServerConfig(user?: AmcatUser): UseQueryResult<AmcatServerConfig> {
  return useQuery(
    ["serverconfig", user?.email],
    async () => {
      if (user == null) return null;
      const res = await getServerConfig(user);
      return res.data;
    },
    { enabled: user != null, staleTime: 600000 }
  );
}
