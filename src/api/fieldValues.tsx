import { AmcatFieldValues, AmcatIndexName } from "@/interfaces";
import { amcatFieldValuesSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";

export function useFieldValues(user: MiddlecatUser, index: AmcatIndexName, field: string | undefined) {
  return useQuery({
    queryKey: ["fieldValues", user, index, field],
    queryFn: async () => getFieldValues(user, index, field || ""),
    enabled: !!field,
  });
}

async function getFieldValues(user: MiddlecatUser, index: AmcatIndexName, field: string) {
  const res = await user.api.get(`index/${index}/fields/${field}/values`);
  const fieldValues: AmcatFieldValues = amcatFieldValuesSchema.parse(res.data);
  return fieldValues;
}
