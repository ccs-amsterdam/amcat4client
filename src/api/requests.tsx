import { AmcatIndexId, AmcatUserRole } from "@/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { useAmcatConfig } from "./config";
import { amcatRequestSchema, amcatSubmitRequestSchema } from "@/schemas";

export function useRequests(user?: MiddlecatUser) {
  return useQuery({
    queryKey: ["role_requests", user],
    queryFn: async () => getRequests(user),
    enabled: !!user,
  });
}

async function getRequests(user?: MiddlecatUser) {
  if (!user) return undefined;
  const res = await user.api.get(`/role_requests`);
  return z.array(amcatRequestSchema).parse(res.data);
}

export function useSubmitRequest(user: MiddlecatUser | undefined, index?: AmcatIndexId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: z.input<typeof amcatSubmitRequestSchema>) => {
      if (!user) throw new Error("Not logged in");
      return submitRequest(user, value, index);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["role_requests", user] });
      return variables.role;
    },
  });
}

export async function submitRequest(
  user: MiddlecatUser | undefined,
  value: z.input<typeof amcatSubmitRequestSchema>,
  index?: AmcatIndexId,
) {
  if (!user) throw new Error("Not logged in");
  if (index) {
    return await user.api.post(`index/${index}/role_requests`, value);
  } else {
    return await user.api.post(`/role_requests`, value);
  }
}
