import { useQuery } from "@tanstack/react-query";
import { amcatUserRoles, amcatIndexSchema } from "@/amcat/schemas";
import { AmcatIndexName, AmcatUserRole } from "@/amcat/interfaces";
import { useHasGlobalRole } from "./userDetails";
import { useAmcatConfig } from "./config";
import { MiddlecatUser } from "middlecat-react";

export function useIndexDetails(user: MiddlecatUser, index: AmcatIndexName) {
  return useQuery({
    queryKey: ["indexdetails", user, index],
    queryFn: async () => getIndex(user, index),
  });
}

export function useMyIndexrole(user: MiddlecatUser, index: AmcatIndexName) {
  const { data: indexDetails } = useIndexDetails(user, index);
  return indexDetails?.user_role;
}

export function useHasIndexRole(user: MiddlecatUser, index: AmcatIndexName, role: AmcatUserRole) {
  const { data: serverConfig } = useAmcatConfig();
  const index_role = useMyIndexrole(user, index);
  const is_global_admin = useHasGlobalRole(user, "ADMIN");
  if (is_global_admin) return true;
  if (serverConfig?.authorization === "no_auth") return true;
  if (!index_role) return undefined;
  const actual_role_index = amcatUserRoles.indexOf(index_role);
  const required_role_index = amcatUserRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}

async function getIndex(user: MiddlecatUser, index: string) {
  const res = await user.api.get(`/index/${index}`);
  return amcatIndexSchema.parse(res.data);
}
