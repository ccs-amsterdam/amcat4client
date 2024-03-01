import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { amcatFieldSchema } from "@/schemas";
import { AmcatField, AmcatFieldElasticType, AmcatIndexId, UpdateAmcatField } from "@/interfaces";
import { toast } from "sonner";

const DEFAULT_CLIENT_SETTINGS: Record<string, any> = {
  date: {
    inDocument: true,
    inList: true,
    inListSummary: true,
  },
  text: {
    inDocument: true,
    inList: true,
  },
  title: {
    inDocument: true,
    inList: true,
  },
  url: {
    inDocument: true,
  },
  __DEFAULT__: {
    inDocument: true,
  },
};

export function useFields(user?: MiddlecatUser, indexName?: AmcatIndexId | undefined) {
  return useQuery({
    queryKey: ["fields", user, indexName],
    queryFn: () => getFields(user, indexName || ""),
    enabled: user != null && indexName != null,
  });
}

export async function getFields(user?: MiddlecatUser, indexName?: AmcatIndexId) {
  if (!user || !indexName) return undefined;
  const res = await user.api.get(`/index/${indexName}/fields`);
  const fieldsArray = Object.keys(res.data).map((name) => ({ name, ...res.data[name] }));
  const fields = z.array(amcatFieldSchema).parse(fieldsArray);
  return fields.map((f) => {
    // set default values
    const default_settings = DEFAULT_CLIENT_SETTINGS[f.name] || DEFAULT_CLIENT_SETTINGS["__DEFAULT__"];
    f.client_settings = { ...default_settings, ...f.client_settings };
    return f;
  });
}

export function getField(fields: AmcatField[] | undefined, fieldname: string): AmcatField | undefined {
  return fields?.find((f) => f.name === fieldname);
}

interface MutateFieldsParams {
  fields: UpdateAmcatField[];
  action: "create" | "delete" | "update";
}

export function useMutateFields(user?: MiddlecatUser, indexName?: AmcatIndexId | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fields, action }: MutateFieldsParams) => {
      if (!user) throw new Error("Not logged in");
      return mutateFields(user, indexName || "", action, fields);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fields", user, indexName] });

      const fieldnames = variables.fields.map((f) => f.name).join(", ");
      if (variables.action === "create") toast.success(`Created fields: ${fieldnames}`);
      if (variables.action === "update") toast.success(`Updated fields: ${fieldnames}`);
      if (variables.action === "delete") toast.success(`Deleted fields: ${fieldnames}`);
    },
  });
}

export async function mutateFields(
  user: MiddlecatUser,
  indexName: AmcatIndexId,
  action: "create" | "delete" | "update",
  fields: UpdateAmcatField[],
) {
  if (!indexName) return undefined;
  const fieldsObject: Record<string, any> = {};

  fields.forEach((f) => {
    if (!f.name) return;
    fieldsObject[f.name] = {};
    if (f.elastic_type) {
      if (action !== "create") throw new Error("Cannot change elastic_type of existing field");
      fieldsObject[f.name].elastic_type = f.elastic_type;
    }

    if (f.metareader) fieldsObject[f.name].metareader = f.metareader;
    if (f.client_settings) fieldsObject[f.name].client_settings = f.client_settings;
  });

  if (action === "delete") {
    return await user.api.delete(`/index/${indexName}/fields`, { data: fields.map((f) => f.name) });
  } else if (action === "create") {
    return await user.api.post(`/index/${indexName}/fields`, fieldsObject);
  } else if (action === "update") {
    return await user.api.put(`/index/${indexName}/fields`, fieldsObject);
  }
}
