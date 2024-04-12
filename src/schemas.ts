import { z } from "zod";

export const amcatConfigSchema = z.object({
  middlecat_url: z.string().url(),
  authorization: z.enum(["allow_guests", "no_auth", "allow_authenticated_guests", "authorized_users_only"]),
  resource: z.string().url(),
});

export const amcatUserRoles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"] as const;
export const amcatUserRoleSchema = z
  .enum(amcatUserRoles)
  .nullish()
  .transform((v) => v ?? "NONE");

export const amcatIndexSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  guest_role: amcatUserRoleSchema,
  user_role: amcatUserRoleSchema,
  archived: z.string().nullable(),
});

export const amcatIndicesItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  guest_role: amcatUserRoleSchema,
  archived: z.string().nullable(),
});
export const amcatIndicesSchema = z.array(amcatIndicesItemSchema);

export const amcatUserDetailsSchema = z.object({
  email: z.string(),
  role: amcatUserRoleSchema,
});

export const amcatFieldTypeSchema = z.enum([
  "text",
  "date",
  "boolean",
  "keyword",
  "number",
  "object",
  "vector",
  "geo",
  "integer",
  "tag",
]);
export const amcatElasticFieldTypeSchema = z.enum([
  "text",
  "annotated_text",
  "binary",
  "match_only_text",
  "date",
  "boolean",
  "keyword",
  "constant_keyword",
  "wildcard",
  "integer",
  "byte",
  "short",
  "long",
  "unsigned_long",
  "float",
  "half_float",
  "double",
  "scaled_float",
  "object",
  "flattened",
  "nested",
  "dense_vector",
  "geo_point",
]);
export const amcatSnippetSchema = z.object({
  nomatch_chars: z.number().default(150),
  max_matches: z.number().default(0),
  match_chars: z.number().default(50),
});
export const amcatMetareaderAccessSchema = z.object({
  access: z.enum(["none", "read", "snippet"]),
  max_snippet: amcatSnippetSchema
    .nullish()
    .transform((o) => o || { nomatch_chars: 150, max_matches: 0, match_chars: 50 }),
});
export const amcatClientSettingsSchema = z.object({
  isHeading: z.boolean().nullish(),
  inList: z.boolean().nullish(),
  inDocument: z.boolean().nullish(),
  inListSummary: z.boolean().nullish(),
});
export const amcatFieldSchema = z.object({
  name: z.string(),
  identifier: z.boolean(),
  type: amcatFieldTypeSchema,
  elastic_type: amcatElasticFieldTypeSchema,
  metareader: amcatMetareaderAccessSchema,
  client_settings: amcatClientSettingsSchema,
});

export const amcatFieldValuesSchema = z.array(z.string());

export const amcatFieldStatsSchema = z
  .object({
    count: z.number(),
    min: z.number(),
    max: z.number(),
    avg: z.number(),
    sum: z.number(),
    min_as_string: z.string().nullish(),
    max_as_string: z.string().nullish(),
    sum_as_string: z.string().nullish(),
    avg_as_string: z.string().nullish(),
  })
  .transform((o) => {
    return {
      ...o,
      min_as_string: o.min_as_string ?? String(o.min),
      max_as_string: o.max_as_string ?? String(o.max),
      sum_as_string: o.sum_as_string ?? String(o.sum),
      avg_as_string: o.avg_as_string ?? String(o.avg),
    };
  });

export const amcatArticleSchema = z.record(z.any()).and(
  z.object({
    _id: z.string(),
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

// aggregation

export const amcatAggregationIntervalSchema = z.enum([
  "day",
  "week",
  "month",
  "quarter",
  "year",
  "daypart",
  "dayofweek",
  "monthnr",
  "yearnr",
  "dayofmonth",
  "weeknr",
]);
export const amcatMetricFunctionSchema = z.enum(["sum", "avg", "min", "max"]);
export const amcatAggregateDataPointSchema = z.record(z.union([z.number(), z.string()]));
export const amcatAggregationAxisSchema = z.object({
  field: z.string(),
  name: z.string(),
  interval: amcatAggregationIntervalSchema.nullish().transform((x) => x ?? undefined),
});
export const amcatAggregationMetricSchema = z.object({
  field: z.string(),
  function: amcatMetricFunctionSchema,
  name: z.string().optional(),
  type: z.string().optional(),
});

export const amcatAggregateDataSchema = z.object({
  data: z.array(amcatAggregateDataPointSchema),
  meta: z.object({
    axes: z.array(amcatAggregationAxisSchema),
    aggregations: z.array(amcatAggregationMetricSchema),
    after: z
      .record(z.any())
      .nullish()
      .transform((x) => x ?? undefined),
  }),
});

export const amcatMultimediaListItem = z.object({
  key: z.string(),
  presigned_get: z.optional(z.string()),
  content_type: z.array(z.string().nullish()).nullish(),
  is_dir: z.boolean(),
  last_modified: z.optional(z.coerce.date()),
  size: z.number().nullish(),
});

export const amcatMultimediaPresignedPost = z.object({
  url: z.string(),
  form_data: z.object({
    policy: z.string(),
    "x-amz-algorithm": z.string(),
    "x-amz-credential": z.string(),
    "x-amz-date": z.string(),
    "x-amz-signature": z.string(),
  }),
});
