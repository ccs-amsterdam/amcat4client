import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { amcatUserDetailsSchema, amcatUserRoleSchema } from "@/schemas";
import { AmcatIndexId } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";

import { z } from "zod";
import { toast } from "sonner";

export function useIndexUsers(user?: MiddlecatUser, indexId?: AmcatIndexId) {
  return useQuery({
    queryKey: ["indexusers", user, indexId],
    queryFn: () => getIndexUsers(user, indexId),
    enabled: !!user && !!indexId,
  });
}

async function getIndexUsers(user?: MiddlecatUser, indexId?: AmcatIndexId) {
  if (!user || !indexId) return undefined;
  const res = await user.api.get(`index/${indexId}/users`);
  const users = z.array(amcatUserDetailsSchema).parse(res.data);
  return users;
}

export function useMutateIndexUser(user?: MiddlecatUser, indexId?: AmcatIndexId | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, role, action }: { email: string; role: string; action: "create" | "delete" | "update" }) => {
      if (!user) throw new Error("Not logged in");
      return mutateIndexUser(user, indexId || "", email, role, action);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["index", user, indexId] });
      queryClient.invalidateQueries({ queryKey: ["indexusers", user, indexId] });
      toast.success(`Changed ${variables.email} role to ${variables.role}`);
    },
  });
}

export async function mutateIndexUser(
  user: MiddlecatUser,
  indexId: AmcatIndexId,
  email: string,
  newRole: string,
  action: "create" | "delete" | "update",
) {
  const role = amcatUserRoleSchema.parse(newRole);
  if (action === "delete") {
    await user.api.delete(`/index/${indexId}/users/${email}`);
  } else if (action === "update") {
    await user.api.put(`/index/${indexId}/users/${email}`, { role });
  } else if (action === "create") {
    await user.api.post(`/index/${indexId}/users`, { email, role });
  }
}
