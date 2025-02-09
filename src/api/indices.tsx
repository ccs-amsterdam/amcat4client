import { amcatIndicesSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";

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
  return amcatIndicesSchema.parse(res.data);
}
