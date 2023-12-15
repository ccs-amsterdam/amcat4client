import {
  AggregateData,
  AggregateDataPoint,
  AggregationAxis,
  AggregationInterval,
} from "@/amcat/interfaces";

interface LongData {
  d: AggregateDataPoint[];
  columns: string[];
}

function should_add_zeroes(interval: AggregationInterval) {
  return ["year", "quarter", "month", "week", "day"].includes(interval);
}

// Convert amcat aggregate results ('long' format data plus axes) into data for recharts ('wide' data and series names)
// Specifically, from [{ row_id, col_id, value }, ...] to [{ row_id, col1: value1, col2: value2, ...}, ...]
export function createChartData(
  data: AggregateData,
  sorted?: boolean
): LongData {
  const fields = data.meta.axes.map((axis) => axis.name);
  const target =
    data.meta.aggregations.length > 0
      ? data.meta.aggregations[0].name || "n"
      : "n";
  const interval = data.meta.axes[0].interval;

  if (fields.length === 1) {
    const d = add_zeroes(data.data, fields[0], interval, [target]);
    return { d, columns: [target] };
  } else
    return longToWide(data.data, data.meta.axes[0], data.meta.axes[1], target);
}

/*
 * Useful functions in dealing with aggregate data
 */
function longToWide(
  data: AggregateDataPoint[],
  primary: AggregationAxis,
  secondary: AggregationAxis,
  target: string,
  interval?: AggregationInterval
): LongData {
  // convert results from amcat to wide format
  const t_col = (val: any) =>
    secondary.interval && can_transform(secondary.interval)
      ? transform_datepart_value(val, secondary.interval).nl
      : val;
  const columns = Array.from(
    new Set(data.map((row) => t_col(row[secondary.name])))
  );
  const dmap = new Map(
    data.map((p) => [
      JSON.stringify([p[primary.name], t_col(p[secondary.name])]),
      p[target],
    ])
  );
  let rows = Array.from(new Set(data.map((row) => row[primary.name])));
  if (interval === "year") rows = daterange(rows, interval);
  let d = rows.map((row) => {
    const p = { [primary.name]: row };
    columns.forEach((col) => {
      const key = JSON.stringify([row, col]);
      p[col] = dmap.has(key) ? dmap.get(key) : 0;
    });
    return p;
  });
  d = add_zeroes(d, primary.name, primary.interval, columns);
  return { d, columns };
}

function ymd(d: Date): string {
  // We use a custom function because toIsoDate (1) includes time, and
  // (2) changes the date to what it would be in UTC time zone, potentially changing the day
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function add_zeroes(
  d: AggregateDataPoint[],
  field: string,
  interval: AggregationInterval | undefined,
  targets: string[]
): AggregateDataPoint[] {
  if (!interval || !should_add_zeroes(interval)) return d;
  const dmap = new Map(d.map((p) => [ymd(new Date(p[field])), p]));
  const dates = daterange(
    d.map((p) => p[field]),
    interval
  );
  const zeroes = Object.fromEntries(targets.map((f) => [f, 0]));
  const result = dates.map(
    (date) => dmap.get(date) || { [field]: date, ...zeroes }
  );
  return result;
}

function incrementDate(date: Date, interval: AggregationInterval) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  switch (interval) {
    case "year":
      return new Date(y + 1, m, d);
    case "quarter":
      return new Date(y, m + 3, d);
    case "month":
      return new Date(y, m + 1, d);
    case "week":
      return new Date(y, m, d + 7);
    case "day":
      return new Date(y, m, d + 1);
    default:
      throw new Error(`Can't handle interval ${interval}, sorry!`);
  }
}

function daterange(values: string[], interval: AggregationInterval): string[] {
  if (interval === "monthnr") {
    return values;
  }
  const result: string[] = [];
  const dates = values.map((d) => new Date(d));
  if (values.length === 0) return result;
  let d = dates.reduce((a, b) => (a < b ? a : b));
  const enddate = dates.reduce((a, b) => (a > b ? a : b));
  while (d <= enddate) {
    result.push(ymd(d));
    d = incrementDate(d, interval);
  }
  return result;
}

export const DATEPARTS_DOW = new Map([
  ["Monday", { nl: "Maandag", _sort: 1 }],
  ["Tuesday", { nl: "Dinsdag", _sort: 2 }],
  ["Wednesday", { nl: "Woensdag", _sort: 3 }],
  ["Thursday", { nl: "Donderdag", _sort: 4 }],
  ["Friday", { nl: "Vrijdag", _sort: 5 }],
  ["Saturday", { nl: "Zaterdag", _sort: 6 }],
  ["Sunday", { nl: "Zondag", _sort: 7 }],
]);

const DATEPARTS_DAYPART = new Map([
  ["Morning", { nl: "Ochtend", _sort: 1 }],
  ["Afternoon", { nl: "Middag", _sort: 2 }],
  ["Evening", { nl: "Avond", _sort: 3 }],
  ["Night", { nl: "Nacht", _sort: 4 }],
]);

const MONTHS = [
  { nl: "Januari", _sort: 1 },
  { nl: "Februari", _sort: 2 },
  { nl: "Maart", _sort: 3 },
  { nl: "April", _sort: 4 },
  { nl: "Mei", _sort: 5 },
  { nl: "Juni", _sort: 6 },
  { nl: "Juli", _sort: 7 },
  { nl: "Augustus", _sort: 8 },
  { nl: "September", _sort: 9 },
  { nl: "Oktober", _sort: 10 },
  { nl: "November", _sort: 11 },
  { nl: "December", _sort: 12 },
];

export function transform_datepart_value(
  value: any,
  interval: string | undefined
) {
  switch (interval) {
    case "dayofweek":
      return DATEPARTS_DOW.get(value);
    case "daypart":
      return DATEPARTS_DAYPART.get(value);
    case "monthnr":
      return MONTHS[value - 1];
    default:
      return value;
  }
}

export function transform_dateparts(
  x: AggregateDataPoint,
  axis: AggregationAxis
) {
  const dp = transform_datepart_value(x[axis.name], axis.interval);
  return dp ? { ...x, [axis.name]: dp.nl, _sort: dp._sort } : x;
}

export function can_transform(interval: string | undefined): boolean {
  if (!interval) return false;
  return ["dayofweek", "daypart", "monthnr"].includes(interval);
}

export function axis_label(axis: AggregationAxis): string {
  if (axis.interval)
    return `${axis.field} (${INTERVAL_LABELS.get(axis.interval)})`;
  return axis.name;
}

export const INTERVAL_LABELS = new Map([
  ["day", "Day"],
  ["week", "Week"],
  ["month", "Month"],
  ["quarter", "Quarter"],
  ["year", "Year"],
  ["dayofweek", "Day of week"],
  ["daypart", "Part of day"],
  ["monthnr", "Month number"],
  ["yearnr", "Year Number"],
  ["dayofmonth", "Day of Month"],
  ["weeknr", "Week Number"],
]);
