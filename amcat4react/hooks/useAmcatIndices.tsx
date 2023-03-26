import { useQuery, UseQueryResult } from "react-query";
import { getIndices } from "../Amcat";
import { useMiddlecatContext } from "../context/middlecat";
import { AmcatIndex } from "../interfaces";

export const QueryKey = ["indices"];

export default function useAmcatIndices(): UseQueryResult<AmcatIndex[]> {
  const { user } = useMiddlecatContext();
  return useQuery(
    QueryKey,
    async () => {
      if (user == null) return null;
      const res = await getIndices(user);
      return res.data;
    },
    { enabled: user != null, staleTime: 60000 }
  );
}
