import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import {
  amcatFieldSchema,
  amcatMultimediaListItem,
  amcatMultimediaPresignedGet,
  amcatMultimediaPresignedPost,
} from "@/schemas";
import { AmcatField, AmcatIndexId, MultimediaListItem, MultimediaPresignedPost, UpdateAmcatField } from "@/interfaces";
import { toast } from "sonner";
import { FileWithPath } from "react-dropzone";
import axios from "axios";
import { get } from "http";

interface MultimediaParams {
  prefix?: string;
  start_after?: string;
  n?: number;
  presigned_get?: boolean;
  metadata?: boolean;
  recursive?: boolean;
}

export function useMultimediaList(user?: MiddlecatUser, indexId?: AmcatIndexId | undefined, params?: MultimediaParams) {
  return useQuery({
    queryKey: ["multimediaList", user, indexId, params],
    queryFn: () => getMultimediaList(user, indexId, params),
    enabled: user != null && indexId != null,
  });
}
async function getMultimediaList(
  user?: MiddlecatUser,
  indexId?: AmcatIndexId,
  params?: MultimediaParams,
): Promise<MultimediaListItem[]> {
  if (!user || !indexId) throw new Error("Missing user or indexId");
  const res = await user.api.get(`/index/${indexId}/multimedia/list`, { params });
  return z.array(amcatMultimediaListItem).parse(res.data);
}

export function useMultimediaPresignedPost(
  user?: MiddlecatUser,
  indexId?: AmcatIndexId | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["multimediaPresignedPost", user, indexId],
    queryFn: async () => {
      if (!user || !indexId) return undefined;
      const res = await user?.api.get(`index/${indexId}/multimedia/presigned_post`);
      return amcatMultimediaPresignedPost.parse(res.data);
    },
    enabled: enabled && user != null && indexId != null,
  });
}

export function useMultimediaPresignedGet(user?: MiddlecatUser, indexId?: AmcatIndexId | undefined, key?: string) {
  return useQuery({
    queryKey: ["presignedUrl", user, indexId, key],
    queryFn: async () => {
      if (!user || !indexId || !key) return undefined;
      const res = await user.api.get(`/index/${indexId}/multimedia/presigned_get`, { params: { key } });
      console.log(res.data);
      return amcatMultimediaPresignedGet.parse(res.data);
    },
    enabled: user != null && indexId != null && key != null,
  });
}

export function useMutateMultimedia(
  user?: MiddlecatUser,
  indexId?: AmcatIndexId | undefined,
  presignedPost?: MultimediaPresignedPost,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: FileWithPath) => {
      if (!user || !indexId || !presignedPost) throw new Error("Missing user, indexId or presignedPost");
      const body = new FormData();
      body.append("key", file.path || file.name);
      for (const [key, value] of Object.entries(presignedPost.form_data)) body.append(key, value);
      body.append("file", file);

      const res = await fetch(presignedPost.url, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error(`Failed to upload file: ${res.statusText}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["multimediaList", user || "", indexId || ""] });
      queryClient.invalidateQueries({ queryKey: ["multimediaFullList", user || "", indexId || ""] });
      toast.success("File uploaded");
    },
  });
}

export function useMultimediaFullList(
  user?: MiddlecatUser,
  indexId?: AmcatIndexId | undefined,
  prefix: string[] | string = "",
) {
  return useQuery({
    queryKey: ["multimediaFullList", user, indexId, prefix],
    queryFn: async () => {
      const batchsize = 100000;
      let data: MultimediaListItem[] = [];
      let start_after: string | undefined = undefined;

      const prefixes = Array.isArray(prefix) ? prefix : [prefix];
      for (const prefix of prefixes) {
        while (true) {
          const params: MultimediaParams = { n: batchsize };
          if (prefix) params.prefix = prefix;
          if (start_after) params.start_after = start_after;
          const batch = await getMultimediaList(user, indexId, params);
          data = [...data, ...batch];
          if (batch.length < batchsize) break;
          start_after = batch[batch.length - 1].key;
        }
      }
      return data;
    },
    retry: false,
    enabled: user != null && indexId != null,
  });
}
