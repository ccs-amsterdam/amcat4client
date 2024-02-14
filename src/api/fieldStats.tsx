import { AmcatFieldStats, AmcatIndexId } from "@/interfaces";
import { amcatFieldStatsSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";

export function useFieldStats(user: MiddlecatUser, indexName: AmcatIndexId, field: string | undefined) {
  return useQuery({
    queryKey: ["fieldStats", user, indexName, field],
    queryFn: async () => getFieldStats(user, indexName, field || ""),
    enabled: !!field,
  });
}

async function getFieldStats(user: MiddlecatUser, indexName: AmcatIndexId, field: string) {
  const res = await user.api.get(`index/${indexName}/fields/${field}/stats`);
  const fieldValues: AmcatFieldStats = amcatFieldStatsSchema.parse(res.data);
  return fieldValues;
}
