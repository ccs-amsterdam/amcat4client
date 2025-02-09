import { AmcatFieldValues, AmcatIndexId } from "@/interfaces";
import { amcatFieldValuesSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";

export function useFieldValues(user: MiddlecatUser, indexId: AmcatIndexId, field: string | undefined) {
  return useQuery({
    queryKey: ["fieldValues", user, indexId, field],
    queryFn: async () => getFieldValues(user, indexId, field || ""),
    enabled: !!field,
  });
}

async function getFieldValues(user: MiddlecatUser, indexId: AmcatIndexId, field: string) {
  const res = await user.api.get(`index/${indexId}/fields/${field}/values`);
  const fieldValues: AmcatFieldValues = amcatFieldValuesSchema.parse(res.data);
  return fieldValues;
}
