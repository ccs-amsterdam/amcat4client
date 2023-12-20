import { z } from "zod";

export const amcatConfigSchema = z.object({
  middlecat_url: z.string().url(),
  authorization: z.enum(["allow_guests", "no_auth", "allow_authenticated_guests", "authorized_users_only"]),
  resource: z.string().url(),
});

export const amcatIndexNameSchema = z.string().regex(/^[a-z0-9_]+$/i);

export const amcatUserRoles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"] as const;
export const amcatUserRoleSchema = z
  .enum(amcatUserRoles)
  .nullish()
  .transform((v) => v ?? "NONE");

export const amcatIndexSchema = z.object({
  id: amcatIndexNameSchema,
  name: z.string(),
  description: z.string().nullish(),
  guest_role: amcatUserRoleSchema.optional(),
  user_role: amcatUserRoleSchema.optional(),
  summary_field: z.string().optional(),
});

export const amcatIndicesSchema = z.array(amcatIndexSchema);

export const amcatUserDetailsSchema = z.object({
  email: z.string(),
  role: amcatUserRoleSchema,
});

export const amcatFieldTypeSchema = z.enum([
  "long",
  "double",
  "object",
  "keyword",
  "date",
  "tag",
  "text",
  "url",
  "geo_point",
  "id",
]);
export const amcatFieldSchema = z.object({
  name: z.string(),
  type: amcatFieldTypeSchema,
  meta: z.record(z.string()).nullish(),
});

export const amcatAnnotationSchema = z.object({
  field: z.string(),
  variable: z.string(),
  value: z.any(),
  offset: z.number(),
  length: z.number(),
  start: z.number().optional(),
  color: z.string().optional(),
});

export const amcatDocumentSchema = z.record(z.any()).and(
  z.object({
    _id: z.string(),
    _annotations: z.array(amcatAnnotationSchema).optional(),
  }),
);

export const amcatQueryResultMetaSchema = z.object({
  page: z.number(),
  page_count: z.number(),
});

export const amcatQueryResultSchema = z.object({
  results: z.array(amcatDocumentSchema),
  meta: amcatQueryResultMetaSchema,
});
