import { amcatIndexSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";

export default function useAmcatIndices(user: MiddlecatUser | undefined, showAll: boolean = false) {
  return useQuery({
    queryKey: ["indices", user, showAll],
    queryFn: () => getIndices(user, showAll),
    enabled: user != null,
  });
}

async function getIndices(user: MiddlecatUser | undefined, showAll: boolean) {
  if (!user) return undefined;

  const params = { show_all: showAll ? 1 : 0 };
  const res = await user.api.get(`/index/`, { params });
  console.log(z.array(amcatIndexSchema).parse(res.data));
  return z.array(amcatIndexSchema).parse(res.data);
}
