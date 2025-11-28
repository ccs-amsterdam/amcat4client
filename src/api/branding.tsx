import { AmcatBranding } from "@/interfaces";
import { amcatBrandingSchema } from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AmcatSessionUser, useAmcatSession } from "@/components/Auth/AuthProvider";
import { toast } from "sonner";
import { z } from "zod";

export function useAmcatBranding() {
  return useQuery({
    queryKey: ["branding"],
    queryFn: () => getAmcatBranding(),
    staleTime: 1000 * 60 * 60 * 1,
  });
}

async function getAmcatBranding() {
  const host = process.env.NEXT_PUBLIC_AMCAT_SERVER;

  function safeParseJson(input: string | null | undefined) {
    try {
      return input == null ? null : JSON.parse(input);
    } catch (error) {
      toast("JSON error parsing branding data, see console for more details");
      console.error(error);
    }
  }

  if (!host) return undefined;
  const res = await axios.get(`${host}/config/branding`, { timeout: 3000 });

  res.data.client_data = safeParseJson(res.data.client_data);
  const result = amcatBrandingSchema.safeParse(res.data);
  if (result.success) return result.data;
  toast("Error parsing branding data, see console for more details");
  console.error(result.error);
  res.data.client_data = undefined;
  const branding: AmcatBranding = amcatBrandingSchema.parse(res.data);
  return branding;
}

export function useMutateBranding(user?: AmcatSessionUser) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: z.input<typeof amcatBrandingSchema>) => {
      // AmCAT API expects a single json blob for the client data
      const body = { ...value, client_data: JSON.stringify(value.client_data) };
      if (!user) throw new Error("Not logged in");
      return mutateBranding(user, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding"] });
    },
  });
}

async function mutateBranding(user: AmcatSessionUser, value: any) {
  return await user.api.put(`config/branding`, value);
}
