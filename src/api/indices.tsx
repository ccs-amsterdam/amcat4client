import { amcatIndexSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";

export default function useAmcatIndices(user: MiddlecatUser | undefined) {
  return useQuery({
    queryKey: ["indices", user],
    queryFn: () => getIndices(user),
    enabled: user != null,
  });
}

async function getIndices(user: MiddlecatUser | undefined) {
  if (!user) return undefined;
  const res = await user.api.get(`/index/`);
  return z.array(amcatIndexSchema).parse(res.data);
}
