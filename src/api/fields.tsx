import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { amcatFieldSchema } from "@/schemas";
import { AmcatField, AmcatIndexName } from "@/interfaces";
import { toast } from "sonner";

export function useFields(user: MiddlecatUser, index: AmcatIndexName | undefined) {
  return useQuery({
    queryKey: ["fields", user, index],
    queryFn: () => getFields(user, index || ""),
    enabled: index != null,
  });
}

export async function getFields(user: MiddlecatUser, index: AmcatIndexName) {
  if (!index) return undefined;
  const res = await user.api.get(`/index/${index}/fields`);
  const fieldsArray = Object.keys(res.data).map((name) => res.data[name]);
  return z.array(amcatFieldSchema).parse(fieldsArray);
}

export function getField(fields: AmcatField[] | undefined, fieldname: string): AmcatField | undefined {
  return fields?.find((f) => f.name === fieldname);
}

export function useMutateFields(user: MiddlecatUser, index: AmcatIndexName | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (field: AmcatField[]) => mutateFields(user, index || "", field),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields", user, index] });
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}

export async function mutateFields(user: MiddlecatUser, index: AmcatIndexName, fields: AmcatField[]) {
  if (!index) return undefined;
  const res = await user.api.post(`/index/${index}/fields`, fields);
}
