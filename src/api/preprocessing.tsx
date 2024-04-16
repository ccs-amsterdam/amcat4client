import { amcatPreprocessingInstruction, amcatPreprocessingTask } from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";

export function usePreprocessingTasks(user: MiddlecatUser) {
  return useQuery({
    queryKey: ["preprocessingTasks"],
    queryFn: async () => {
      const res = await user.api.get("/preprocessing_tasks");
      console.log(res.data);
      return z.array(amcatPreprocessingTask).parse(res.data);
    },
  });
}

export function usePreprocessingInstructions(user: MiddlecatUser, indexId: string) {
  return useQuery({
    queryKey: ["preprocessingInstructions", user, indexId],
    queryFn: async () => {
      const res = await user.api.get(`/index/${indexId}/preprocessing`);
      return z.array(amcatPreprocessingInstruction).parse(res.data);
    },
  });
}

export function useMutatePreprocessingInstruction(user: MiddlecatUser, indexId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instruction: any) => {
      await user.api.post(`/index/${indexId}/preprocessing`, instruction);
      queryClient.invalidateQueries({ queryKey: ["preprocessingInstructions", user, indexId] });
    },
  });
}
