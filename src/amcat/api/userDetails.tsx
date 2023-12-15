import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  AmcatRole,
  AmcatRoles,
  AmcatUser,
  AmcatUserInfo,
} from "@/amcat/interfaces";
import { useServerConfig } from "./serverConfig";

export function useCurrentUserDetails(user?: AmcatUser) {
  return useQuery({
    queryKey: ["users", user],
    queryFn: async () => getCurrentUserDetails(user),
    enabled: user != null,
    retry: (_: any, e: AxiosError) => {
      // Don't retry on 404, this just means the user is not known
      console.log(e.response?.status);
      return e.response?.status != 404;
    },
  });
}

export function useMyGlobalRole(user: AmcatUser | undefined) {
  const { data: userInfo } = useCurrentUserDetails(user);
  return userInfo?.role;
}

export function useHasGlobalRole(user: AmcatUser | undefined, role: AmcatRole) {
  const { serverConfig } = useServerConfig(user);
  const actual_role = useMyGlobalRole(user);
  if (serverConfig?.authorization === "no_auth") return true;
  if (actual_role == null) return undefined;
  const actual_role_index = AmcatRoles.indexOf(actual_role);
  const required_role_index = AmcatRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}

async function getCurrentUserDetails(user: AmcatUser | undefined) {
  if (!user) return;
  if (!user.email) return;
  const res = await user.api.get(`/users/me`);
  const userInfo: AmcatUserInfo = {
    ...res.data,
    role: res.data.role.toUpperCase(),
  };
  return userInfo;
}
