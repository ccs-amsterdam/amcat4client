import { AmcatUser, AmcatIndexName, AmcatField } from "@/amcat/interfaces";
import { useQuery } from "@tanstack/react-query";

export function useFields(user: AmcatUser, index: AmcatIndexName | undefined) {
  return useQuery({
    queryKey: ["fields", user, index],
    queryFn: () => getFields(user, index || ""),
    enabled: index != null,
  });
}

export async function getFields(user: AmcatUser, index: AmcatIndexName) {
  const res = await user.api.get(`/index/${index}/fields`);
  const fields: AmcatField[] = res.data ? Object.values(res.data) : [];
  return fields;
}

export function getField(
  fields: AmcatField[] | undefined,
  fieldname: string
): AmcatField | undefined {
  return fields?.find((f) => f.name === fieldname);
}
