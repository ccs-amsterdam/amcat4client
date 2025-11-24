import { AmcatRequest, AmcatRequestProject, AmcatRequestProjectRole, AmcatRequestServerRole } from "@/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { amcatRequestSchema } from "@/schemas";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";

export function useRequests(user?: MiddlecatUser) {
  return useQuery({
    queryKey: ["permission_requests/admin", user],
    queryFn: async () => getRequests(user),
    enabled: !!user?.email,
  });
}

export function useMyRequests(user?: MiddlecatUser) {
  return useQuery({
    queryKey: ["permission_requests", user],
    queryFn: async () => getMyRequests(user),
    enabled: !!user?.email,
  });
}

export function useDeleteMyRequest(user: MiddlecatUser | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AmcatRequest["request"]) => deleteMyRequest(user, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission_requests", user] });
    },
  });
}

async function getRequests(user?: MiddlecatUser) {
  if (!user?.email) return undefined;
  const res = await user.api.get(`/permission_requests/admin`);
  console.log(res.data);
  return z.array(amcatRequestSchema).parse(res.data);
}

async function getMyRequests(user?: MiddlecatUser) {
  if (!user?.email) return undefined;
  const res = await user.api.get(`/permission_requests`);
  return z.array(amcatRequestSchema).parse(res.data);
}

async function deleteMyRequest(user: MiddlecatUser | undefined, request: AmcatRequest["request"]) {
  if (!user) throw new Error("Not logged in");
  return await user.api.delete(`/permission_requests`, { data: request });
}

export function useSubmitRequest(user: MiddlecatUser | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: AmcatRequest["request"]) => {
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

export async function submitRequest(user: MiddlecatUser | undefined, value: AmcatRequest["request"]) {
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
      queryClient.invalidateQueries({ queryKey: ["permission_requests", user] });
      queryClient.invalidateQueries({ queryKey: ["permission_requests/admin", user] });

      // invalidate things that can refer to changed roles or indices
      queryClient.invalidateQueries({ queryKey: ["users", user] });
      queryClient.invalidateQueries({ queryKey: ["currentuserdetails", user] });
      queryClient.invalidateQueries({ queryKey: ["indices", user] });

      for (const r of variables) {
        if ("project_id" in r.request) {
          queryClient.invalidateQueries({ queryKey: ["index", user, r.request.project_id] });
          queryClient.invalidateQueries({ queryKey: ["indexusers", user, r.request.project_id] });
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
