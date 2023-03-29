import { AxiosError } from "axios";
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
      return { ...res.data, role: res.data.role.toUpperCase() };
    },
    {
      enabled: user != null,
      staleTime: 600000,
      retry: (_, e: AxiosError) => {
        // Don't retry on 404, this just means the user is not known
        console.log(e.response?.status);
        return e.response?.status != 404;
      },
    }
  );
}

export function useMyGlobalRole(user: AmcatUser | undefined) {
  const currentUserQuery = useCurrentUserDetails(user);
  if (!currentUserQuery.isSuccess || currentUserQuery.data == null) return undefined;
  return currentUserQuery.data.role;
}

export function useHasGlobalRole(user: AmcatUser | undefined, role: AmcatRole) {
  const serverconfig = useServerConfig(user);
  const actual_role = useMyGlobalRole(user);
  if (serverconfig.isSuccess && serverconfig.data.authorization === "no_auth") return true;
  if (actual_role == null) return undefined;
  const actual_role_index = AmcatRoles.indexOf(actual_role);
  const required_role_index = AmcatRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}
