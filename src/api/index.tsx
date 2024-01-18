import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { amcatUserRoles, amcatIndexSchema } from "@/schemas";
import { AmcatIndexName, AmcatUserRole } from "@/interfaces";
import { useHasGlobalRole } from "./userDetails";
import { useAmcatConfig } from "./config";
import { MiddlecatUser } from "middlecat-react";
import { toast } from "sonner";

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
  return amcatIndexSchema.parse(res.data);
}

interface MutateIndexParams {
  id: AmcatIndexName;
  action: "create" | "delete" | "update";
  name?: string;
  description?: string;
  summary_field?: string;
  guest_role?: AmcatUserRole;
}

export function useMutateIndex(user: MiddlecatUser, indexName: AmcatIndexName) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name, description, summary_field, guest_role, action }: MutateIndexParams) => {
      if (!user) throw new Error("Not logged in");
      return mutateIndx(user, indexName, action, name, description, summary_field, guest_role);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["index", user, indexName] });
      queryClient.invalidateQueries({ queryKey: ["indices", user] });

      if (variables.action === "create") toast.success(`Created index ${variables.id}`);
      if (variables.action === "update") toast.success(`Updated index ${variables.id}`);
      if (variables.action === "delete") toast.success(`Deleted index ${variables.id}`);
    },
    onError: (error: any, variables) => {
      toast(`Could not ${variables.action} user: `, { description: error?.response?.data?.detail || error.message });
    },
  });
}

export async function mutateIndx(
  user: MiddlecatUser,
  id: AmcatIndexName,
  action: "create" | "delete" | "update",
  name?: string,
  description?: string,
  summary_field?: string,
  guest_role?: AmcatUserRole,
) {
  if (action === "delete") {
    return await user.api.delete(`index/${id}`);
  } else if (action === "create") {
    return await user.api.post(`index`, { id, name, description, summary_field, guest_role });
  } else if (action === "update") {
    return await user.api.put(`index/${id}`, { name, description, summary_field, guest_role });
  }
}
