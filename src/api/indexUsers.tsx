import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { amcatUserDetailsSchema, amcatUserRoleSchema } from "@/schemas";
import { AmcatIndexName, AmcatUserRole } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";

import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useIndexUsers(user?: MiddlecatUser, index?: AmcatIndexName) {
  return useQuery({
    queryKey: ["indexusers", user, index],
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
    mutationFn: ({ email, role, action }: { email: string; role: string; action: "create" | "delete" | "update" }) => {
      if (!user) throw new Error("Not logged in");
      return mutateIndexUser(user, index || "", email, role, action);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["indexdetails", user, index] });
      queryClient.invalidateQueries({ queryKey: ["indexusers", user, index] });
      toast(`Changed ${variables.email} role to ${variables.role}`);
    },
    onError: (error: any) => {
      toast(error?.response?.data?.detail || error.message);
    },
  });
}

export async function mutateIndexUser(
  user: MiddlecatUser,
  index: AmcatIndexName,
  email: string,
  newRole: string,
  action: "create" | "delete" | "update",
) {
  const role = amcatUserRoleSchema.parse(newRole);
  if (action === "delete") {
    await user.api.delete(`/index/${index}/users/${email}`);
  } else if (action === "update") {
    await user.api.put(`/index/${index}/users/${email}`, { role });
  } else if (action === "create") {
    await user.api.post(`/index/${index}/users`, { email, role });
  }
}
