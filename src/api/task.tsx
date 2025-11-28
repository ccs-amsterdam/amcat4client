import { taskSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";
import { AmcatSessionUser } from "@/components/Auth/AuthProvider";

export function useTaskStatus(user?: AmcatSessionUser, taskId?: string | null) {
  return useQuery({
    queryKey: ["task_status", taskId],
    queryFn: async () => {
      if (user == null) return null;

      const res = await user.api.get(`task/${taskId}`, { timeout: 3000 });
      return taskSchema.parse(res.data);
    },
    enabled: user != null && taskId != null,
    staleTime: 1000 * 5 * 1,
  });
}
