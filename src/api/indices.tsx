import { amcatIndexSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";

export default function useAmcatIndices(
  user: MiddlecatUser | undefined,
  showAll: boolean = false,
  minimal: boolean = false,
) {
  return useQuery({
    queryKey: ["indices", user, showAll, minimal],
    queryFn: () => getIndices(user, showAll, minimal),
    enabled: user != null,
  });
}

async function getIndices(user: MiddlecatUser | undefined, showAll: boolean, minimal: boolean) {
  if (!user) return undefined;

  const params = { show_all: showAll ? 1 : 0, minimal: minimal ? 1 : 0 };
  const res = await user.api.get(`/index`, { params });
  return z.array(amcatIndexSchema).parse(res.data);
}
