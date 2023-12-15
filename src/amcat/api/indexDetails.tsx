import { AmcatIndex, AmcatIndexName, AmcatUser } from "@/amcat/interfaces";
import { useQuery } from "@tanstack/react-query";

import { AmcatRole, AmcatRoles } from "@/amcat/interfaces";
import { useHasGlobalRole } from "./userDetails";
import { useServerConfig } from "./serverConfig";

export function useIndexDetails(user: AmcatUser, index: AmcatIndexName) {
  return useQuery({
    queryKey: ["indexdetails", user, index],
    queryFn: async () => getIndex(user, index),
  });
}

export function useMyIndexrole(user: AmcatUser, index: AmcatIndexName) {
  const { data: indexDetails } = useIndexDetails(user, index);
  return indexDetails?.user_role;
}

export function useHasIndexRole(
  user: AmcatUser,
  index: AmcatIndexName,
  role: AmcatRole
) {
  const { serverConfig } = useServerConfig(user);
  const index_role = useMyIndexrole(user, index);
  const is_global_admin = useHasGlobalRole(user, "ADMIN");
  if (is_global_admin) return true;
  if (serverConfig?.authorization === "no_auth") return true;
  if (!index_role) return undefined;
  const actual_role_index = AmcatRoles.indexOf(index_role);
  const required_role_index = AmcatRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}

async function getIndex(user: AmcatUser, index: string) {
  const res = await user.api.get(`/index/${index}`);
  const indexDetails: AmcatIndex = res.data;
  return indexDetails;
}
