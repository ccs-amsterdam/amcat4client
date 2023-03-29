import { useQuery } from "react-query";
import { getIndex } from "../Amcat";
import { useMiddlecatContext } from "../context/middlecat";
import { AmcatRole, AmcatRoles } from "../interfaces";
import { useHasGlobalRole } from "./useCurrentUserDetails";
import { useServerConfig } from "./useServerConfig";

export function useIndexDetailsQuery(index: string) {
  const { user } = useMiddlecatContext();
  return useQuery(
    ["indexdetails", index],
    async () => user && (await getIndex(user, index)).data,
    {
      enabled: user != null && index != null,
      staleTime: 600000,
    }
  );
}

export function useMyIndexrole(index: string) {
  const indexdetails = useIndexDetailsQuery(index);
  if (!indexdetails.isSuccess || !indexdetails.data?.user_role)
    return undefined;
  return indexdetails.data.user_role;
}

export function useHasIndexRole(index: string, role: AmcatRole) {
  const { user } = useMiddlecatContext();
  const serverconfig = useServerConfig(user);
  const index_role = useMyIndexrole(index);
  const is_global_admin = useHasGlobalRole(user, "ADMIN");
  if (is_global_admin) return true;
  if (serverconfig.isSuccess && serverconfig.data.authorization === "no_auth")
    return true;
  if (!index_role) return undefined;
  const actual_role_index = AmcatRoles.indexOf(index_role);
  const required_role_index = AmcatRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}
