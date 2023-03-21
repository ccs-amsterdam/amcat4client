import { useQuery, UseQueryResult } from "react-query";
import { getCurrentUserDetails } from "../Amcat";
import { AmcatRole, AmcatRoles, AmcatUser, AmcatUserInfo } from "../interfaces";
import { useServerConfig } from "./useServerConfig";

export function useCurrentUserDetails(user?: AmcatUser): UseQueryResult<AmcatUserInfo> {
  return useQuery(
    ["users", user],
    async () => {
      if (user == null) return null;
      if (user.email === "") return {};
      const res = await getCurrentUserDetails(user);
      return { ...res.data, global_role: res.data.global_role.toUpperCase() };
    },
    { enabled: user != null, staleTime: 60000 }
  );
}

export function useHasGlobalRole(user: AmcatUser | undefined, role: AmcatRole) {
  const currentUserQuery = useCurrentUserDetails(user);
  const serverconfig = useServerConfig(user);
  if (serverconfig.isSuccess && serverconfig.data.authorization === "no_auth") return true;
  if (!currentUserQuery.isSuccess || currentUserQuery.data == null) return undefined;
  const actual_role_index = AmcatRoles.indexOf(currentUserQuery.data.global_role);
  const required_role_index = AmcatRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}
