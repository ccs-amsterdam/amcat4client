import { MiddlecatUser } from "middlecat-react";
import { ReactNode } from "react";

export interface AmcatUser extends MiddlecatUser {}

export type DisplayOption = "list" | "table" | "linechart" | "barchart";
export type AggregationInterval =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "daypart"
  | "dayofweek"
  | "monthnr"
  | "yearnr"
  | "dayofmonth"
  | "weeknr";

// NOTE: name was optional before, supposedly because
// there are cases where you only want to specify that 'a'
// field of a cetain type should be used. However, we really
// should then just infer the name before making the AggregationAxis,
// or Typescript goes nuts.
// For cases where there is no name (like _query type field) we'll just use ""
export interface AggregationAxis {
  // also seems to be field name, but then why also have name?
  field: string;
  // the name of the field
  name: string;
  interval?: AggregationInterval;
}

export type MetricFunction = "sum" | "avg" | "min" | "max";

// NOTE: the meaning of names seems very different from AggregationAxis?
// need to verify this with Wouter
export interface AggregationMetric {
  // the name of the field
  field: string;
  function: MetricFunction;
  // maybe just a label?
  name?: string;
  // the type of the field
  type?: string;
}

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
  /* If true, do not yet present results */
  hold?: boolean;
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
}

export interface AmcatField {
  name: string;
  type:
    | "long"
    | "double"
    | "object"
    | "keyword"
    | "date"
    | "tag"
    | "text"
    | "url"
    | "geo_point"
    | "id";
  meta?: { [field: string]: string };
}

export interface AmcatFilters {
  [field: string]: AmcatFilter;
}

export type AmcatQueryTerms = { [label: string]: string };

export interface AmcatQuery {
  filters?: AmcatFilters;
  queries?: AmcatQueryTerms;
}

export type AggregateDataPoint = { [key: string]: any };

export type AggregateData = {
  data: AggregateDataPoint[];
  meta: { axes: AggregationAxis[]; aggregations: AggregationMetric[] };
};

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

export type AmcatIndexName = string;
export interface AmcatIndex {
  name: AmcatIndexName;
}

export interface AmcatDocument {
  /** We can see if a text has been processed by addAnnotations
      if it's an array. But there should be a more elegant solution (WvA nods) */
  _id: string;
  text?: string | any[];
  date?: Date;
  url?: string;
  title?: string;
  _annotations?: any[];
  [key: string]: any;
}

export interface AmcatQueryResult {
  results?: AmcatDocument[];
  meta?: { page_count?: number };
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

export type SortSpec =
  | string
  | string[]
  | { [field: string]: { order?: "asc" | "desc" } }[];
