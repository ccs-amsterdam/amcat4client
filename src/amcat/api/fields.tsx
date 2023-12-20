import { useQuery } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { amcatFieldSchema } from "@/amcat/schemas";
import { AmcatField, AmcatIndexName } from "@/amcat/interfaces";

export function useFields(user: MiddlecatUser, index: AmcatIndexName | undefined) {
  return useQuery({
    queryKey: ["fields", user, index],
    queryFn: () => getFields(user, index || ""),
    enabled: index != null,
  });
}

export async function getFields(user: MiddlecatUser, index: AmcatIndexName) {
  const res = await user.api.get(`/index/${index}/fields`);
  const fieldsArray = Object.keys(res.data).map((name) => res.data[name]);
  return z.array(amcatFieldSchema).parse(fieldsArray);
}

export function getField(fields: AmcatField[] | undefined, fieldname: string): AmcatField | undefined {
  return fields?.find((f) => f.name === fieldname);
}
