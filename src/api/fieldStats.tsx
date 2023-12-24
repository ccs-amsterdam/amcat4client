import { AmcatFieldStats, AmcatIndexName } from "@/interfaces";
import { amcatFieldStatsSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";

export function useFieldStats(user: MiddlecatUser, index: AmcatIndexName, field: string | undefined) {
  return useQuery({
    queryKey: ["fieldStats", user, index, field],
    queryFn: async () => getFieldStats(user, index, field || ""),
    enabled: !!field,
  });
}

async function getFieldStats(user: MiddlecatUser, index: AmcatIndexName, field: string) {
  const res = await user.api.get(`index/${index}/fields/${field}/stats`);
  const fieldValues: AmcatFieldStats = amcatFieldStatsSchema.parse(res.data);
  return fieldValues;
}
