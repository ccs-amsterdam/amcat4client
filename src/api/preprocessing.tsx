import {
  amcatPreprocessingInstruction,
  amcatPreprocessingInstructionDetails,
  amcatPreprocessingInstructionStatus,
  amcatPreprocessingTask,
} from "@/schemas";
import { UseQueryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { toast } from "sonner";
import { z } from "zod";

export function usePreprocessingTasks(user: MiddlecatUser) {
  return useQuery({
    queryKey: ["preprocessingTasks"],
    queryFn: async () => {
      const res = await user.api.get("/preprocessing_tasks");
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
      queryClient.invalidateQueries({ queryKey: ["articles", user, indexId] });
      queryClient.invalidateQueries({ queryKey: ["aggregate", user, indexId] });
      queryClient.invalidateQueries({ queryKey: ["article", user, indexId] });
      toast.success("Preprocessing instruction submitted");
    },
  });
}

export function usePreprocessingInstructionDetails(
  user: MiddlecatUser,
  indexId: string,
  field: string,
  extra_options = {},
) {
  return useQuery({
    queryKey: ["preprocessingInstructionDetails", user, indexId, field],
    queryFn: async () => {
      const res = await user.api.get(`/index/${indexId}/preprocessing/${field}`);
      return amcatPreprocessingInstructionDetails.parse(res.data);
    },
    staleTime: 1000,
    ...extra_options,
  });
}

export function usePreprocessingInstructionStatus(
  user: MiddlecatUser,
  indexId: string,
  field: string,
  extra_options = {},
) {
  return useQuery({
    queryKey: ["preprocessingInstructionStatus", user, indexId, field],
    queryFn: async () => {
      const res = await user.api.get(`/index/${indexId}/preprocessing/${field}/status`);
      return amcatPreprocessingInstructionStatus.parse(res.data);
    },
    staleTime: 1000,
    ...extra_options,
  });
}

export function useMutatePreprocessingInstructionAction(user: MiddlecatUser, indexId: string, field: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: any) => {
      await user.api.post(`/index/${indexId}/preprocessing/${field}/status`, { action });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["preprocessingInstructionDetails", user, indexId, field] });
      queryClient.invalidateQueries({ queryKey: ["preprocessingInstructionStatus", user, indexId, field] });
      toast.success(`Sent preprocessing action ${variables} to ${field}`);
    },
  });
}
