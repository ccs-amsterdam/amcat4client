import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { amcatBrandingSchema } from "@/schemas";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { z } from "zod";

export function useAmcatBranding() {
  const { fixedResource: host } = useMiddlecat();
  return useQuery({
    queryKey: ["branding"],
    queryFn: () => getAmcatBranding(host),
    staleTime: 1000 * 60 * 60 * 1,
  });
}

export async function getAmcatBranding(host?: string) {
  if (!host) return undefined;
  const res = await axios.get(`${host}/config/branding`, { timeout: 3000 });
  return amcatBrandingSchema.parse(res.data);
}

export function useMutateBranding(user?: MiddlecatUser) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: z.input<typeof amcatBrandingSchema>) => {
      if (!user) throw new Error("Not logged in");
      return mutateBranding(user, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding"] });
    },
  });
}
export async function mutateBranding(user: MiddlecatUser, value: z.input<typeof amcatBrandingSchema>) {
  return await user.api.put(`config/branding`, value);
}
