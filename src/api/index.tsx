import { AmcatIndexId, AmcatUserRole } from "@/interfaces";
import { amcatIndexSchema, amcatIndexUpdateSchema, amcatUserRoles } from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { useAmcatConfig } from "./config";
import { hasMinAmcatRole } from "@/lib/utils";

export function useIndex(user?: MiddlecatUser, indexId?: AmcatIndexId) {
  return useQuery({
    queryKey: ["index", user, indexId],
    queryFn: async () => getIndex(user, indexId),
    enabled: !!user && !!indexId,
  });
}

export function useMyIndexrole(user?: MiddlecatUser, indexId?: AmcatIndexId) {
  const { data: serverConfig } = useAmcatConfig();
  const { data: index } = useIndex(user, indexId);
  if (serverConfig?.authorization === "no_auth") return "ADMIN";
  return index?.user_role;
}

export function useHasIndexRole(user: MiddlecatUser | undefined, indexId: AmcatIndexId, role: AmcatUserRole) {
  const index_role = useMyIndexrole(user, indexId);
  if (!index_role) return undefined;
  return hasMinAmcatRole(index_role, role);
}

async function getIndex(user?: MiddlecatUser, indexId?: string) {
  if (!user || !indexId) return undefined;
  const res = await user.api.get(`/index/${indexId}`);
  return amcatIndexSchema.parse(res.data);
}

export function useCreateIndex(user: MiddlecatUser | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: z.input<typeof amcatIndexSchema>) => {
      if (!user) throw new Error("Not logged in");
      return createIndex(user, value);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["indices", user] });
      return variables.id;
    },
  });
}

export async function createIndex(user: MiddlecatUser | undefined, value: z.input<typeof amcatIndexSchema>) {
  if (!user) throw new Error("Not logged in");
  if (value.guest_role === "NONE") value.guest_role = undefined;
  return await user.api.post(`/index/`, value);
}

export function useMutateIndex(user: MiddlecatUser | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: z.input<typeof amcatIndexUpdateSchema>) => mutateIndex(user, value),
    onSuccess: (_, value) => {
      queryClient.invalidateQueries({ queryKey: ["index", user, value.id] });
      queryClient.invalidateQueries({ queryKey: ["indices", user] });
      return value.id;
    },
  });
}

export async function mutateIndex(user: MiddlecatUser | undefined, value: z.input<typeof amcatIndexUpdateSchema>) {
  if (!user) throw new Error("Not logged in");
  return await user.api.put(`index/${value.id}`, value);
}

export function useDeleteIndex(user: MiddlecatUser | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (indexId: string) => deleteIndex(user, indexId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indices", user] });
    },
  });
}

export async function deleteIndex(user: MiddlecatUser | undefined, indexId: string) {
  if (!user) throw new Error("Not logged in");
  return await user.api.delete(`index/${indexId}`);
}
