import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MiddlecatUser } from "middlecat-react";
import { z } from "zod";
import { amcatFieldSchema, amcatMultimediaListItem, amcatMultimediaPresignedPost } from "@/schemas";
import { AmcatField, AmcatIndexId, MultimediaPresignedPost, UpdateAmcatField } from "@/interfaces";
import { toast } from "sonner";
import { FileWithPath } from "react-dropzone";
import axios from "axios";

export function useMultimediaList(
  user?: MiddlecatUser,
  indexId?: AmcatIndexId | undefined,
  prefix?: string,
  start_after?: string,
  n: number = 10,
) {
  return useQuery({
    queryKey: ["multimediaList", user, indexId],
    queryFn: () => getMultimediaList(user, indexId || "", prefix, start_after, n),
    enabled: user != null && indexId != null,
  });
}
async function getMultimediaList(
  user?: MiddlecatUser,
  indexId?: AmcatIndexId,
  prefix?: string,
  start_after?: string,
  n: number = 10,
) {
  if (!user || !indexId) return undefined;
  const params: Record<string, string | number> = { n };
  if (prefix) params.prefix = prefix;
  if (start_after) params.start_after = start_after;
  const res = await user.api.get(`/index/${indexId}/multimedia/list`);
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
      body.append("file", file);
      for (const [key, value] of Object.entries(presignedPost.form_data)) body.append(key, value);

      // cant get this to work.
      // complain is that the X-Amz-Credential parameter is mallformed
      const res = await fetch(presignedPost.url, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error(`Failed to upload file: ${res.statusText}`);
      //   await axios.post(presignedPost.url, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["multimediaList", user || "", indexId || ""] });
      toast.success("File uploaded");
    },
  });
}

function mutateMultimedia(file: File, presignedPost: MultimediaPresignedPost) {}
