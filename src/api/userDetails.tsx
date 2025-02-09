import { AmcatUserRole } from "@/interfaces";
import { amcatUserDetailsSchema, amcatUserRoles } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { useAmcatConfig } from "./config";

export function useCurrentUserDetails(user?: MiddlecatUser) {
  return useQuery({
    queryKey: ["currentuserdetails", user],
    queryFn: async () => getCurrentUserDetails(user),
    enabled: user != null,
    retry: (_: any) => {
      // Don't retry. It's either forbidden or user not known
      return false;
    },
  });
}

export function useMyGlobalRole(user?: MiddlecatUser | undefined) {
  const { data: userInfo } = useCurrentUserDetails(user);
  return userInfo?.role;
}

export function useHasGlobalRole(user: MiddlecatUser | undefined, role: AmcatUserRole) {
  const { data: serverConfig } = useAmcatConfig();
  const actual_role = useMyGlobalRole(user);
  if (!user) return undefined;
  if (serverConfig?.authorization === "no_auth") return true;
  if (actual_role == null) return undefined;
  const actual_role_index = amcatUserRoles.indexOf(actual_role);
  const required_role_index = amcatUserRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}

async function getCurrentUserDetails(user: MiddlecatUser | undefined) {
  if (!user?.email) return null;
  const res = await user.api.get(`/users/me`);
  return amcatUserDetailsSchema.parse(res.data);
}
