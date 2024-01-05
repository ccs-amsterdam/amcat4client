import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { amcatFieldSchema } from "@/schemas";
import { AmcatField, AmcatFieldType, AmcatFieldMeta, AmcatIndexName } from "@/interfaces";
import { toast } from "sonner";
import {
  parseClientDisplay,
  parseMetareader,
  stringifyClientDisplay,
  stringifyMetareader,
} from "@/lib/serializeFieldMeta";

export function useFields(user?: MiddlecatUser, index?: AmcatIndexName | undefined) {
  return useQuery({
    queryKey: ["fields", user, index],
    queryFn: () => getFields(user, index || ""),
    enabled: user != null && index != null,
  });
}

export async function getFields(user?: MiddlecatUser, index?: AmcatIndexName) {
  if (!user || !index) return undefined;
  const res = await user.api.get(`/index/${index}/fields`);
  const fieldsArray = Object.keys(res.data).map((name) => res.data[name]);
  fieldsArray.forEach((f) => {
    // field meta data is serialized as a compact string, because elastic limits meta characters. We parse it here.
    // !! this also allows us to ensure that client_display and metareader_access are always set with default values.
    //    (this does mean we need to take care that the default metareader_access is identical in the backend)
    if (f.meta?.client_display !== undefined) f.meta.client_display = parseClientDisplay(f.meta.client_display);
    if (f.meta?.metareader_access !== undefined) f.meta.metareader_access = parseMetareader(f.meta.metareader_access);
  });
  return z.array(amcatFieldSchema).parse(fieldsArray);
}

export function getField(fields: AmcatField[] | undefined, fieldname: string): AmcatField | undefined {
  return fields?.find((f) => f.name === fieldname);
}

export function useMutateFields(user?: MiddlecatUser, index?: AmcatIndexName | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: AmcatField[]) => {
      if (!user) throw new Error("Not logged in");
      return mutateFields(user, index || "", fields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields", user, index] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export async function mutateFields(user: MiddlecatUser, index: AmcatIndexName, fields: AmcatField[]) {
  if (!index) return undefined;

  // field meta data is serialized as a compact string, because elastic limits meta characters.
  const fieldsObject: Record<
    string,
    {
      type: AmcatFieldType;
      meta: {
        amcat4_type?: string;
        client_display?: string;
        metareader_access?: string;
      };
    }
  > = {};
  fields.forEach((f) => {
    fieldsObject[f.name] = { type: f.type, meta: {} };
    if (f.meta?.amcat4_type != null) fieldsObject[f.name].meta.amcat4_type = f.meta.amcat4_type;
    if (f.meta?.client_display != null)
      fieldsObject[f.name].meta.client_display = stringifyClientDisplay(f.meta.client_display);
    if (f.meta?.metareader_access != null)
      fieldsObject[f.name].meta.metareader_access = stringifyMetareader(f.meta.metareader_access);
  });

  return await user.api.post(`/index/${index}/fields`, fieldsObject);
}
