import { AmcatIndexName } from "@/amcat/interfaces";
import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";

export function useFieldValues(user: MiddlecatUser, index: AmcatIndexName, field: string) {
  return useQuery({
    queryKey: ["fieldValues", user, index, field],
    queryFn: async () => getFieldValues(user, index, field),
  });
}

async function getFieldValues(user: MiddlecatUser, index: AmcatIndexName, field: string) {
  const res = await user.api.get(`index/${index}/fields/${field}/values`);
  const fieldValues: string[] = res.data;
  return fieldValues;
}
