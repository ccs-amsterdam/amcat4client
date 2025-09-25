import { AmcatIndexId, AmcatRequest, AmcatUserRole } from "@/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { useAmcatConfig } from "./config";
import { amcatRequestSchema } from "@/schemas";

export function useRequests(user?: MiddlecatUser) {
  return useQuery({
    queryKey: ["permission_requests/admin", user],
    queryFn: async () => getRequests(user),
    enabled: !!user,
  });
}

export function useMyRequests(user?: MiddlecatUser) {
  return useQuery({
    queryKey: ["permission_requests", user],
    queryFn: async () => getMyRequests(user),
    enabled: !!user,
  });
}

async function getRequests(user?: MiddlecatUser) {
  if (!user) return undefined;
  const res = await user.api.get(`/permission_requests/admin`);
  return z.array(amcatRequestSchema).parse(res.data);
}

async function getMyRequests(user?: MiddlecatUser) {
  if (!user) return undefined;
  const res = await user.api.get(`/permission_requests`);
  return z.array(amcatRequestSchema).parse(res.data);
}

export function useSubmitRequest(user: MiddlecatUser | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: AmcatRequest) => {
      if (!user) throw new Error("Not logged in");
      return submitRequest(user, value);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["permission_requests", user] });
      queryClient.invalidateQueries({ queryKey: ["permission_requests/admin", user] });

      return variables;
    },
  });
}

export async function submitRequest(user: MiddlecatUser | undefined, value: AmcatRequest) {
  if (!user) throw new Error("Not logged in");
  return await user.api.post(`/permission_requests`, value);
}

export function useResolveRequests(user: MiddlecatUser | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: AmcatRequest[]) => {
      if (!user) throw new Error("Not logged in");
      return resolveRequests(user, value);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["permission_requests/admin", user] });
      queryClient.invalidateQueries({ queryKey: ["permission_requests/admin", user] });

      // invalidate things that can refer to changed roles or indices
      queryClient.invalidateQueries({ queryKey: ["users", user] });
      queryClient.invalidateQueries({ queryKey: ["currentuserdetails", user] });
      queryClient.invalidateQueries({ queryKey: ["indices", user] });

      for (const r of variables) {
        if ("index" in r) {
          queryClient.invalidateQueries({ queryKey: ["index", user, r.index] });
          queryClient.invalidateQueries({ queryKey: ["indexusers", user, r.index] });
        }
      }
      return variables;
    },
  });
}

export async function resolveRequests(user: MiddlecatUser | undefined, value: AmcatRequest[]) {
  if (!user) throw new Error("Not logged in");
  return await user.api.post(`/permission_requests/admin`, value);
}
