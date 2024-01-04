import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { amcatUserDetailsSchema, amcatUserRoleSchema } from "@/schemas";
import { MiddlecatUser } from "middlecat-react";

import { z } from "zod";
import { toast } from "sonner";

export function useUsers(user?: MiddlecatUser) {
  return useQuery({
    queryKey: ["users", user],
    queryFn: () => getUsers(user),
    enabled: !!user,
  });
}

async function getUsers(user?: MiddlecatUser) {
  if (!user) return undefined;
  const res = await user.api.get(`users`);
  const users = z.array(amcatUserDetailsSchema).parse(res.data);
  return users;
}

export function useMutateUser(user?: MiddlecatUser) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, role, action }: { email: string; role: string; action: "create" | "delete" | "update" }) => {
      if (!user) throw new Error("Not logged in");
      return mutateUser(user, email, role, action);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", user] });
      queryClient.invalidateQueries({ queryKey: ["currentuserdetails", user] });
      if (variables.role === "NONE") {
        toast.success(`Deleted user ${variables.email}`);
      } else {
        toast.success(`User ${variables.email} has role ${variables.role}`);
      }
    },
    onError: (error: any, variables) => {
      toast(`Could not ${variables.action} user: `, { description: error?.response?.data?.detail || error.message });
    },
  });
}

export async function mutateUser(
  user: MiddlecatUser,
  email: string,
  newRole: string,
  action: "create" | "delete" | "update",
) {
  const role = amcatUserRoleSchema.parse(newRole);
  if (action === "delete") {
    return await user.api.delete(`users/${email}`);
  } else if (action === "create") {
    return await user.api.post(`users`, { email, role });
  } else if (action === "update") {
    return await user.api.put(`users/${email}`, { role });
  }
}
