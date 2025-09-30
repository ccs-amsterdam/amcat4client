import { AmcatUserRole } from "@/interfaces";
import { amcatUserDetailsSchema, amcatUserRoleSchema, amcatUserRoles } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { useAmcatConfig } from "./config";
import { useSearchParams } from "next/navigation";
import { hasMinAmcatRole } from "@/lib/utils";

export function useCurrentUserDetails(user?: MiddlecatUser) {
  const params = useSearchParams();

  // This is a development feature to simulate different server roles without having to change them on the server
  const fakeServerRole = params?.get("fake_server_role") || undefined;

  return useQuery({
    queryKey: ["currentuserdetails", user],
    queryFn: async () => getCurrentUserDetails(user, fakeServerRole),
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
  return hasMinAmcatRole(actual_role, role);
}

async function getCurrentUserDetails(user: MiddlecatUser | undefined, fakeServerRole?: string) {
  if (!user?.email) return null;
  const res = await user.api.get(`/users/me`);
  const details = amcatUserDetailsSchema.parse(res.data);
  if (fakeServerRole) details.role = amcatUserRoleSchema.parse(fakeServerRole);
  return details;
}
