import { amcatIndexSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";

interface Params {
  showAll?: boolean;
  showArchived?: boolean;
  minimal?: boolean;
}

export default function useAmcatIndices(user: MiddlecatUser | undefined, params?: Params) {
  return useQuery({
    queryKey: ["indices", user, params],
    queryFn: () => getIndices(user, params),
    enabled: user != null,
  });
}

async function getIndices(user: MiddlecatUser | undefined, p?: Params) {
  if (!user) return undefined;

  const params = {
    show_all: p?.showAll ? 1 : 0,
    minimal: p?.minimal ? 1 : 0,
    show_archived: p?.showArchived ? 1 : 0,
  };
  const res = await user.api.get(`/index`, { params });
  return z.array(amcatIndexSchema).parse(res.data);
}
