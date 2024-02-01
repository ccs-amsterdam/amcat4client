import { Axios } from "axios";
import { ReactNode } from "react";
import { z } from "zod";
import {
  amcatConfigSchema,
  amcatIndexNameSchema,
  amcatUserRoleSchema,
  amcatIndexSchema,
  amcatIndicesSchema,
  amcatUserDetailsSchema,
  amcatFieldTypeSchema,
  amcatFieldSchema,
  amcatArticleSchema,
  amcatQueryResultMetaSchema,
  amcatQueryResultSchema,
  amcatAnnotationSchema,
  amcatFieldValuesSchema,
  amcatFieldStatsSchema,
  amcatClientDisplaySchema,
  amcatMetareaderAccessSchema,
  amcatSnippetSchema,
  amcatFieldElasticTypeSchema,
  amcatAggregationIntervalSchema,
  amcatMetricFunctionSchema,
  amcatAggregateDataPointSchema,
  amcatAggregationAxisSchema,
  amcatAggregationMetricSchema,
  amcatAggregateDataSchema,
} from "./schemas";

export type AmcatConfig = z.infer<typeof amcatConfigSchema>;
export type AmcatIndexName = z.infer<typeof amcatIndexNameSchema>;
export type AmcatUserRole = z.infer<typeof amcatUserRoleSchema>;
export type AmcatIndex = z.infer<typeof amcatIndexSchema>;
export type AmcatIndices = z.infer<typeof amcatIndicesSchema>;
export type AmcatUserDetails = z.infer<typeof amcatUserDetailsSchema>;
export type AmcatFieldType = z.infer<typeof amcatFieldTypeSchema>;
export type AmcatFieldElasticType = z.infer<typeof amcatFieldElasticTypeSchema>;
export type AmcatField = z.infer<typeof amcatFieldSchema>;
export type UpdateAmcatField = Partial<AmcatField>;
export type AmcatArticle = z.infer<typeof amcatArticleSchema>;
export type AmcatQueryResultMeta = z.infer<typeof amcatQueryResultMetaSchema>;
export type AmcatQueryResult = z.infer<typeof amcatQueryResultSchema>;
export type AmcatAnnotation = z.infer<typeof amcatAnnotationSchema>;
export type AmcatFieldValues = z.infer<typeof amcatFieldValuesSchema>;
export type AmcatFieldStats = z.infer<typeof amcatFieldStatsSchema>;
export type AmcatSnippet = z.infer<typeof amcatSnippetSchema>;
export type AmcatMetareaderAccess = z.infer<typeof amcatMetareaderAccessSchema>;
export type AmcatClientDisplay = z.infer<typeof amcatClientDisplaySchema>;
export type AggregationInterval = z.infer<typeof amcatAggregationIntervalSchema>;
export type MetricFunction = z.infer<typeof amcatMetricFunctionSchema>;
export type AggregateDataPoint = z.infer<typeof amcatAggregateDataPointSchema>;
export type AggregationAxis = z.infer<typeof amcatAggregationAxisSchema>;
export type AggregationMetric = z.infer<typeof amcatAggregationMetricSchema>;
export type AggregateData = z.infer<typeof amcatAggregateDataSchema>;

export type DisplayOption = "list" | "table" | "linechart" | "barchart";

// NOTE: name was optional before, supposedly because
// there are cases where you only want to specify that 'a'
// field of a cetain type should be used. However, we really
// should then just infer the name before making the AggregationAxis,
// or Typescript goes nuts.
// For cases where there is no name (like _query type field) we'll just use ""

//TODO: think about how visual and data options relate, e.g. limit.
export interface AggregationOptions {
  /* Aggregation axes, i.e. [{field: "publisher"}] */
  axes?: AggregationAxis[];
  /* Display option, i,e, "linechart" or "barchart" */
  display?: DisplayOption;
  /* Use a specific metric rather than count -- only allow one metric for now */
  metrics?: AggregationMetric[];
  /* Limit the number of rows/lines/bars */
  limit?: number;
  /* Show a title */
  title?: string;
}

export interface DateFilter {
  lte?: string;
  gte?: string;
  lt?: string;
  gt?: string;
}

export interface AmcatFilter extends DateFilter {
  values?: (string | number)[];
  exists?: boolean;
  justAdded?: boolean;
}

export interface AmcatFilters {
  [field: string]: AmcatFilter;
}

export interface AmcatQueryTerm {
  label?: string;
  query: string;
}

export interface AmcatQuery {
  filters?: AmcatFilters;
  queries?: AmcatQueryTerm[];
}

export interface AmcatQueryFieldSpec {
  name: string;
  snippet?: AmcatSnippet;
}

export interface AmcatQueryParams {
  page?: number;
  fields?: (string | AmcatQueryFieldSpec)[];
  highlight?: boolean;
}

export type AggregateVisualizer = (props: any) => ReactNode;
export interface AggregateVisualizerProps {
  /***
   * The data to visualize
   */
  data: AggregateData;
  /**
   * Callback when user clicks on a point,
   * should be an array of values of equal length to the # of axes
   * */
  onClick: (value: any[]) => void;
  /* Width of the component (default: 100%) */
  width?: string | number;
  /* Height of the component (default: 300) */
  height?: string | number;
  /* Limit the number of bars/lines/rows */
  limit?: number;
}

export interface LocationOptions {
  /** Field name refering to a geo_point field in this index */
  field: string;
  /** Maximum number of documents to use (default: 100)*/
  numdocs?: number;
  /** Width of the map (default: '100%') */
  width?: number | string;
  /** Height of the map (default: 600) */
  height?: number | string;
}

export type SortSpec = string | string[] | { [field: string]: { order?: "asc" | "desc" } }[];

export interface MenuRoute {
  label: string;
  pathname: string;
  reqRole?: AmcatUserRole;
}
