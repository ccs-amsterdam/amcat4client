import { useQuery } from "@tanstack/react-query";
import { amcatUserRoles, amcatIndexSchema } from "@/schemas";
import { AmcatIndexName, AmcatUserRole } from "@/interfaces";
import { useHasGlobalRole } from "./userDetails";
import { useAmcatConfig } from "./config";
import { MiddlecatUser } from "middlecat-react";

export function useIndex(user?: MiddlecatUser, indexName?: AmcatIndexName) {
  return useQuery({
    queryKey: ["index", user, indexName],
    queryFn: async () => getIndex(user, indexName),
    enabled: !!user && !!indexName,
  });
}

export function useMyIndexrole(user: MiddlecatUser, indexName: AmcatIndexName) {
  const { data: index } = useIndex(user, indexName);
  return index?.user_role;
}

export function useHasIndexRole(user: MiddlecatUser, indexName: AmcatIndexName, role: AmcatUserRole) {
  const { data: serverConfig } = useAmcatConfig();
  const index_role = useMyIndexrole(user, indexName);
  const is_global_admin = useHasGlobalRole(user, "ADMIN");
  if (is_global_admin) return true;
  if (serverConfig?.authorization === "no_auth") return true;
  if (!index_role) return undefined;
  const actual_role_index = amcatUserRoles.indexOf(index_role);
  const required_role_index = amcatUserRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}

async function getIndex(user?: MiddlecatUser, indexName?: string) {
  if (!user || !indexName) return undefined;
  const res = await user.api.get(`/index/${indexName}`);
  console.log(res.data);
  return amcatIndexSchema.parse(res.data);
}
