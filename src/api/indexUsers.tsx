import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { amcatUserDetailsSchema, amcatUserRoleSchema } from "@/schemas";
import { AmcatIndexName, AmcatUserRole } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";

import { z } from "zod";
import { toast } from "sonner";

export function useIndexUsers(user?: MiddlecatUser, index?: AmcatIndexName) {
  return useQuery({
    queryKey: ["users", user, index],
    queryFn: () => getIndexUsers(user, index),
    enabled: !!user && !!index,
  });
}

async function getIndexUsers(user?: MiddlecatUser, index?: AmcatIndexName) {
  if (!user || !index) return undefined;
  const res = await user.api.get(`index/${index}/users`);
  const users = z.array(amcatUserDetailsSchema).parse(res.data);
  return users;
}

export function useMutateIndexUser(user?: MiddlecatUser, index?: AmcatIndexName | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) => mutateIndexUser(user, index || "", email, role),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["indexdetails", user, index] });
      queryClient.invalidateQueries({ queryKey: ["users", user, index] });
      toast(`Changed ${variables.email} role to ${variables.role}`);
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}

export async function mutateIndexUser(user?: MiddlecatUser, index?: AmcatIndexName, email?: string, newRole?: string) {
  if (!user || !index || !email || !newRole) return undefined;
  const role = amcatUserRoleSchema.parse(newRole);
  if (role === "NONE") {
    await user.api.delete(`/index/${index}/users/${email}`);
  } else {
    await user.api.post(`/index/${index}/users`, { email, role });
  }
}
