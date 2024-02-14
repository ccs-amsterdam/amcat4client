import { AmcatFieldValues, AmcatIndexId } from "@/interfaces";
import { amcatFieldValuesSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";

export function useFieldValues(user: MiddlecatUser, indexName: AmcatIndexId, field: string | undefined) {
  return useQuery({
    queryKey: ["fieldValues", user, indexName, field],
    queryFn: async () => getFieldValues(user, indexName, field || ""),
    enabled: !!field,
  });
}

async function getFieldValues(user: MiddlecatUser, indexName: AmcatIndexId, field: string) {
  const res = await user.api.get(`index/${indexName}/fields/${field}/values`);
  const fieldValues: AmcatFieldValues = amcatFieldValuesSchema.parse(res.data);
  return fieldValues;
}
