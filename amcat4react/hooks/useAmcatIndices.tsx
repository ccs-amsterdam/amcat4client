import { useQuery, UseQueryResult } from "react-query";
import { getIndices } from "../Amcat";
import { AmcatIndex, AmcatUser } from "../interfaces";

export default function useAmcatIndices(
  user: AmcatUser | undefined
): UseQueryResult<AmcatIndex[]> {
  const indices: UseQueryResult<AmcatIndex[]> = useQuery(
    ["indices", user],
    async () => {
      if (user == null) return null;
      const res = await getIndices(user);
      return res.data;
    }
  );

  return indices;
}
