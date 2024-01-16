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
  summary_field: z.string().nullish(),
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
export const amcatSnippetSchema = z.object({
  nomatch_chars: z.number().default(150),
  max_matches: z.number().default(0),
  match_chars: z.number().default(50),
});
export const amcatMetareaderAccessSchema = z.object({
  access: z.enum(["none", "read", "snippet"]),
  max_snippet: amcatSnippetSchema.nullish().transform((o) => o || { nomatch_chars: 0, max_matches: 0, match_chars: 0 }),
});
export const amcatClientDisplaySchema = z.object({
  in_list: z.boolean(),
  in_document: z.boolean(),
});
export const amcatFieldSchema = z.object({
  name: z.string(),
  type: amcatFieldTypeSchema,
  metareader: amcatMetareaderAccessSchema,
  client_display: amcatClientDisplaySchema,
});

export const amcatFieldValuesSchema = z.array(z.string());

export const amcatFieldStatsSchema = z.object({
  count: z.number(),
  min: z.number(),
  max: z.number(),
  avg: z.number(),
  sum: z.number(),
  min_as_string: z.string(),
  max_as_string: z.string(),
  sum_as_string: z.string(),
  avg_as_string: z.string(),
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

export const amcatArticleSchema = z.record(z.any()).and(
  z.object({
    _id: z.string(),
    _annotations: z.array(amcatAnnotationSchema).optional(),
  }),
);

export const amcatQueryResultMetaSchema = z.object({
  total_count: z.number(),
  per_page: z.number(),
  page: z.number(),
  page_count: z.number().nullable(),
});

export const amcatQueryResultSchema = z.object({
  results: z.array(amcatArticleSchema),
  meta: amcatQueryResultMetaSchema,
});

export const amcatIndexUsers = z.object({
  email: z.string(),
  role: amcatUserRoleSchema,
});
