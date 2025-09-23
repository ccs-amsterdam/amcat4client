import { AmcatIndexId, AmcatUserRole } from "@/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { useAmcatConfig } from "./config";
import { amcatRoleRequestSchema, amcatSubmitRoleRequestSchema } from "@/schemas";

export function useRoleRequests(user?: MiddlecatUser) {
  return useQuery({
    queryKey: ["role_request", user],
    queryFn: async () => getRoleRequests(user),
    enabled: !!user,
  });
}

async function getRoleRequests(user?: MiddlecatUser) {
  if (!user) return undefined;
  const res = await user.api.get(`/role_request`);
  return z.array(amcatRoleRequestSchema).parse(res.data);
}

export function useSubmitRoleRequest(user: MiddlecatUser | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: z.input<typeof amcatSubmitRoleRequestSchema>) => {
      if (!user) throw new Error("Not logged in");
      return submitRoleRequest(user, value);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["role_request", user] });
      return variables.role;
    },
  });
}

export async function submitRoleRequest(
  user: MiddlecatUser | undefined,
  value: z.input<typeof amcatSubmitRoleRequestSchema>,
) {
  if (!user) throw new Error("Not logged in");
  return await user.api.post(`/role_request`, value);
}
