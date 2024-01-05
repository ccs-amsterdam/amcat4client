import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { amcatUserDetailsSchema, amcatUserRoleSchema } from "@/schemas";
import { AmcatIndexName } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";

import { z } from "zod";
import { toast } from "sonner";

export function useIndexUsers(user?: MiddlecatUser, indexName?: AmcatIndexName) {
  return useQuery({
    queryKey: ["indexusers", user, indexName],
    queryFn: () => getIndexUsers(user, indexName),
    enabled: !!user && !!indexName,
  });
}

async function getIndexUsers(user?: MiddlecatUser, indexName?: AmcatIndexName) {
  if (!user || !indexName) return undefined;
  const res = await user.api.get(`index/${indexName}/users`);
  const users = z.array(amcatUserDetailsSchema).parse(res.data);
  return users;
}

export function useMutateIndexUser(user?: MiddlecatUser, indexName?: AmcatIndexName | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, role, action }: { email: string; role: string; action: "create" | "delete" | "update" }) => {
      if (!user) throw new Error("Not logged in");
      return mutateIndexUser(user, indexName || "", email, role, action);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["index", user, indexName] });
      queryClient.invalidateQueries({ queryKey: ["indexusers", user, indexName] });
      toast.success(`Changed ${variables.email} role to ${variables.role}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || error.message);
    },
  });
}

export async function mutateIndexUser(
  user: MiddlecatUser,
  indexName: AmcatIndexName,
  email: string,
  newRole: string,
  action: "create" | "delete" | "update",
) {
  const role = amcatUserRoleSchema.parse(newRole);
  if (action === "delete") {
    await user.api.delete(`/index/${indexName}/users/${email}`);
  } else if (action === "update") {
    await user.api.put(`/index/${indexName}/users/${email}`, { role });
  } else if (action === "create") {
    await user.api.post(`/index/${indexName}/users`, { email, role });
  }
}
