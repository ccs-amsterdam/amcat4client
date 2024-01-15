import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { amcatFieldSchema } from "@/schemas";
import { AmcatField, AmcatFieldType, AmcatIndexName, UpdateAmcatField } from "@/interfaces";
import { toast } from "sonner";

export function useFields(user?: MiddlecatUser, indexName?: AmcatIndexName | undefined) {
  return useQuery({
    queryKey: ["fields", user, indexName],
    queryFn: () => getFields(user, indexName || ""),
    enabled: user != null && indexName != null,
  });
}

export async function getFields(user?: MiddlecatUser, indexName?: AmcatIndexName) {
  if (!user || !indexName) return undefined;
  const res = await user.api.get(`/index/${indexName}/fields`);
  const fieldsArray = Object.keys(res.data).map((name) => res.data[name]);
  return z.array(amcatFieldSchema).parse(fieldsArray);
}

export function getField(fields: AmcatField[] | undefined, fieldname: string): AmcatField | undefined {
  return fields?.find((f) => f.name === fieldname);
}

export function useMutateFields(user?: MiddlecatUser, indexName?: AmcatIndexName | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: UpdateAmcatField[]) => {
      if (!user) throw new Error("Not logged in");
      return mutateFields(user, indexName || "", fields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields", user, indexName] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export async function mutateFields(user: MiddlecatUser, indexName: AmcatIndexName, fields: UpdateAmcatField[]) {
  if (!indexName) return undefined;

  // field meta data is serialized as a compact string, because elastic limits meta characters.
  const fieldsObject: Record<string, Omit<UpdateAmcatField, "name">> = {};

  fields.forEach((f) => {
    if (!f.name) return;
    fieldsObject[f.name] = {};
    if (f.type) fieldsObject[f.name].type = f.type;
    if (f.metareader) fieldsObject[f.name].metareader = f.metareader;
    if (f.client_display) fieldsObject[f.name].client_display = f.client_display;
  });

  return await user.api.post(`/index/${indexName}/fields`, fieldsObject);
}
