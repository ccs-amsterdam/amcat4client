import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAmcatConfig } from "./config";
import { MiddlecatUser } from "middlecat-react";
import { amcatUserDetailsSchema, amcatUserRoles } from "@/amcat/schemas";
import { AmcatUserRole } from "@/amcat/interfaces";

export function useCurrentUserDetails(user?: MiddlecatUser) {
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

export function useMyGlobalRole(user: MiddlecatUser | undefined) {
  const { data: userInfo } = useCurrentUserDetails(user);
  return userInfo?.role;
}

export function useHasGlobalRole(user: MiddlecatUser | undefined, role: AmcatUserRole) {
  if (!user) return undefined;
  const { data: serverConfig } = useAmcatConfig(user.resource);
  const actual_role = useMyGlobalRole(user);
  if (serverConfig?.authorization === "no_auth") return true;
  if (actual_role == null) return undefined;
  const actual_role_index = amcatUserRoles.indexOf(actual_role);
  const required_role_index = amcatUserRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}

async function getCurrentUserDetails(user: MiddlecatUser | undefined) {
  if (!user?.email) return;
  const res = await user.api.get(`/users/me`);
  return amcatUserDetailsSchema.parse(res.data);
}
