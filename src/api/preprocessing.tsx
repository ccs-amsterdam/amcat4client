import { amcatPreprocessingInstruction, amcatPreprocessingInstructionStatus, amcatPreprocessingTask } from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { toast } from "sonner";
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
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["preprocessingInstructions", user, indexId] });
      queryClient.invalidateQueries({ queryKey: ["fields", user, indexId] });
      toast.success("Preprocessing instruction submitted");
    },
  });
}

export function usePreprocessingInstructionDetails(user: MiddlecatUser, indexId: string, field: string) {
  return useQuery({
    queryKey: ["preprocessingInstruction", user, indexId, field],
    queryFn: async () => {
      const res = await user.api.get(`/index/${indexId}/preprocessing/${field}`);
      return amcatPreprocessingInstructionStatus.parse(res.data);
    },
  });
}
