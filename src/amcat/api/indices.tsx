import { AmcatIndex, AmcatUser } from "@/amcat/interfaces";
import { useQuery } from "@tanstack/react-query";

export default function useAmcatIndices(user: AmcatUser | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["indices", user],
    queryFn: () => getIndices(user),
    enabled: user != null,
    staleTime: 60000,
  });

  const indices: AmcatIndex[] = data ? Object.values(data) : [];
  return { indices, isLoading, error, refetch };
}

async function getIndices(user: AmcatUser | undefined) {
  if (!user) return;
  const res = await user.api.get(`/index/`);
  const indices: AmcatIndex[] = res.data;
  return indices;
}
