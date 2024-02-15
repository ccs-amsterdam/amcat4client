import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { amcatUserRoles, amcatIndexSchema } from "@/schemas";
import { AmcatIndexId, AmcatUserRole } from "@/interfaces";
import { useHasGlobalRole } from "./userDetails";
import { useAmcatConfig } from "./config";
import { MiddlecatUser } from "middlecat-react";
import { toast } from "sonner";

export function useIndex(user?: MiddlecatUser, indexId?: AmcatIndexId) {
  return useQuery({
    queryKey: ["index", user, indexId],
    queryFn: async () => getIndex(user, indexId),
    enabled: !!user && !!indexId,
  });
}

export function useMyIndexrole(user?: MiddlecatUser, indexId?: AmcatIndexId) {
  const { data: index } = useIndex(user, indexId);
  return index?.user_role;
}

export function useHasIndexRole(user: MiddlecatUser, indexId: AmcatIndexId, role: AmcatUserRole) {
  const { data: serverConfig } = useAmcatConfig();
  const index_role = useMyIndexrole(user, indexId);
  const is_global_admin = useHasGlobalRole(user, "ADMIN");
  if (is_global_admin) return true;
  if (serverConfig?.authorization === "no_auth") return true;
  if (!index_role) return undefined;
  const actual_role_index = amcatUserRoles.indexOf(index_role);
  const required_role_index = amcatUserRoles.indexOf(role);
  return actual_role_index >= required_role_index;
}

async function getIndex(user?: MiddlecatUser, indexId?: string) {
  if (!user || !indexId) return undefined;
  const res = await user.api.get(`/index/${indexId}`);
  return amcatIndexSchema.parse(res.data);
}

interface MutateIndexParams {
  id: AmcatIndexId;
  action: "create" | "delete" | "update";
  name?: string;
  description?: string;
  summary_field?: string;
  guest_role?: AmcatUserRole;
}

export function useMutateIndex(user: MiddlecatUser | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name, description, summary_field, guest_role, action }: MutateIndexParams) => {
      if (!user) throw new Error("Not logged in");
      return mutateIndex(user, id, action, name, description, summary_field, guest_role);
    },
    onSuccess: (_, variables) => {
      const indexId = variables.id;
      queryClient.invalidateQueries({ queryKey: ["index", user, indexId] });
      queryClient.invalidateQueries({ queryKey: ["indices", user] });

      if (variables.action === "create") toast.success(`Created index ${variables.id}`);
      if (variables.action === "update") toast.success(`Updated index ${variables.id}`);
      if (variables.action === "delete") toast.success(`Deleted index ${variables.id}`);

      return variables.id;
    },
  });
}

export async function mutateIndex(
  user: MiddlecatUser | undefined,
  id: AmcatIndexId,
  action: "create" | "delete" | "update",
  name?: string,
  description?: string,
  summary_field?: string,
  guest_role?: AmcatUserRole,
) {
  if (!user) throw new Error("Not logged in");
  if (action === "delete") {
    return await user.api.delete(`index/${id}`);
  } else if (action === "create") {
    return await user.api.post(`index`, { id, name, description, summary_field, guest_role });
  } else if (action === "update") {
    return await user.api.put(`index/${id}`, { name, description, summary_field, guest_role });
  }
}
