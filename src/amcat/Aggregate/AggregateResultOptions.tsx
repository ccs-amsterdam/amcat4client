import {
  AmcatUser,
  AggregationAxis,
  AggregationInterval,
  AggregationMetric,
  AmcatQuery,
  AmcatIndexName,
  AggregationOptions,
  DisplayOption,
  MetricFunction,
} from "@/amcat/interfaces";

import { useFields, getField } from "@/amcat/api/fields";
import { Dropdown, Option } from "@/components/ui/dropdown";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Tally5, TextCursor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

// Style Idea:
// Just single button with dropdown menu
// each item is a component that can be set (e.g., x-axis, aggregate)
// each item then has a combobox to select the column

interface Props {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
  options: AggregationOptions;
  setOptions: Dispatch<SetStateAction<AggregationOptions>>;
}

export default function AggregateResultOptions({
  user,
  index,
  query,
  options,
  setOptions,
}: Props) {
  const [newOptions, setNewOptions] = useState(options);

  useEffect(() => {
    // deep copy using serialization. Should not be a problem,
    // since we want options to be serializable anyway
    setNewOptions(JSON.parse(JSON.stringify(options)));
  }, [options]);

  function setAxis(i: number, newval?: AggregationAxis) {
    const axes = options.axes == null ? [] : [...options.axes];
    if (newval == null) {
      axes.splice(i, 1);
    } else axes[i] = newval;
    setNewOptions({ ...options, axes });
  }
  function submit() {
    setOptions(newOptions);
  }
  function optionsIdentical() {
    return JSON.stringify(options) === JSON.stringify(newOptions);
  }
  function optionsInvalid() {
    if (!newOptions.display) return true;
    if (newOptions.metrics?.length === 0) return true;
    if (newOptions.axes?.length === 0) return true;
    return false;
  }

  const labels = aggregation_labels[options.display || "list"];

  const rowClassName = "w-full";

  return (
    <div className=" prose w-72">
      <div className="flex flex-col gap-3">
        <div className="">
          <div className="label">Display</div>
          <div className={rowClassName}>
            <DisplayPicker options={newOptions} setOptions={setNewOptions} />
          </div>
        </div>

        <div className="">
          <div className="label">Aggregate</div>
          <div className={rowClassName}>
            <MetricPicker
              user={user}
              index={index}
              value={newOptions.metrics?.[0]}
              onChange={(newval) =>
                setNewOptions({
                  ...newOptions,
                  metrics: newval == null ? undefined : [newval],
                })
              }
            />
          </div>
        </div>

        <div className="">
          <div className="label">{labels[0]}</div>

          <div className={rowClassName}>
            <AxisPicker
              user={user}
              index={index}
              query={query}
              value={newOptions.axes?.[0]}
              onChange={(newval) => setAxis(0, newval)}
            />
          </div>
        </div>

        <div className="">
          <div className="label">{labels[1]}</div>

          <div className={rowClassName}>
            <AxisPicker
              user={user}
              index={index}
              query={query}
              value={newOptions.axes?.[1]}
              onChange={(newval) => setAxis(1, newval)}
              clearable
            />
          </div>
        </div>
        <Button
          disabled={optionsIdentical() || optionsInvalid()}
          onClick={submit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

const displayOptions: {
  value: DisplayOption;
  text: string;
  icon: React.JSX.Element;
}[] = [
  {
    value: "linechart",
    text: "Line Graph",
    icon: <DynamicIcon type="line graph" />,
  },
  {
    value: "barchart",
    text: "Bar Chart",
    icon: <DynamicIcon type="bar chart" />,
  },
  { value: "list", text: "List", icon: <DynamicIcon type="list" /> },
  { value: "table", text: "Table", icon: <DynamicIcon type="table" /> },
];

const aggregation_labels = {
  list: ["Group results by", "And then by", "Maximum number of rows"],
  table: ["Rows", "Columns", "(not used)"],
  linechart: [
    "Horizontal (X) axis",
    "Multiple lines",
    "Maximum number of lines",
  ],
  barchart: ["Create bars for", "Cluster bars by", "Maximum number of bars"],
};

const INTERVALS = [
  { value: "day", text: "Day" },
  { value: "week", text: "Week" },
  { value: "month", text: "Month" },
  { value: "quarter", text: "Quarter" },
  { value: "year", text: "Year" },
  { value: "daypart", text: "Daypart" },
  { value: "dayofweek", text: "Day of week" },
  { value: "monthnr", text: "Month number" },
  { value: "yearnr", text: "Year number" },
  { value: "dayofmonth", text: "Day of month" },
  { value: "weeknr", text: "Week number" },
];

const METRIC_FUNCTIONS = [
  { types: ["long", "double"], value: "sum", text: "Sum" },
  { types: ["long", "double"], value: "avg", text: "Average" },
  { types: ["long", "double"], value: "min", text: "Minimum" },
  { types: ["long", "double"], value: "max", text: "Maximum" },
];

interface DisplayPickerProps {
  options: AggregationOptions;
  setOptions: Dispatch<SetStateAction<AggregationOptions>>;
}

function DisplayPicker({ options, setOptions }: DisplayPickerProps) {
  function setDisplay(value: DisplayOption) {
    setOptions({ ...options, display: value });
  }

  return (
    <Dropdown
      placeholder=""
      options={displayOptions}
      value={options.display || "linechart"}
      onChange={({ value }) => setDisplay(value as DisplayOption)}
    />
  );
}

interface MetricPickerProps {
  user: AmcatUser;
  index: AmcatIndexName;
  value?: AggregationMetric;
  onChange: (value?: AggregationMetric) => void;
}
function MetricPicker({ user, index, value, onChange }: MetricPickerProps) {
  const { data: fields } = useFields(user, index);

  if (fields == null) return null;
  const metricFieldOptions = useMemo(() => {
    const metricFieldOptions: Option[] = [
      {
        text: "Count",
        value: "_total",
        icon: <Tally5 />,
      },
    ];
    for (let field of fields) {
      const options = METRIC_FUNCTIONS.filter(
        (f) => !f.types || f.types?.includes(field.type)
      );
      if (options.length === 0) continue;

      metricFieldOptions.push({
        text: field.name,
        value: field.name,
        icon: <DynamicIcon type={field.type} />,
        options,
      });
    }

    return metricFieldOptions;
  }, [fields]);

  function setValues(func?: string, field?: string) {
    if (func === "_total") return onChange(undefined);
    const result = { ...value, function: func as MetricFunction, field };
    onChange(result as AggregationMetric);
  }

  return (
    <Dropdown
      placeholder="Aggregation function"
      options={metricFieldOptions}
      value={value?.field || "_total"}
      value2={value?.function}
      onChange={({ value, value2 }) => {
        if (value === "_total") return setValues("_total");
        const field: string | undefined = value;
        const func: string | undefined = value2;
        setValues(func, field);
      }}
    />
  );
}

interface AxisPickerProps {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
  value?: AggregationAxis;
  onChange: (value?: AggregationAxis) => void;
  clearable?: boolean;
}
function AxisPicker({
  user,
  index,
  query,
  value,
  onChange,
  clearable = false,
}: AxisPickerProps) {
  const { data: fields } = useFields(user, index);

  const fieldoptions = useMemo(() => {
    const fieldoptions = (fields ?? [])
      .filter((f) => ["date", "keyword", "tag"].includes(f.type))
      .map((f) => ({
        text: f.name,
        value: f.name,
        icon: <DynamicIcon type={f.type} />,
        options: f.type === "date" ? INTERVALS : undefined,
      }));

    if (query.queries) {
      fieldoptions.unshift({
        text: "By query",
        value: "_query",
        icon: <TextCursor />,
        options: undefined,
      });
    }
    return fieldoptions;
  }, [fields, query.queries]);

  function setValues(field: string, interval?: AggregationInterval) {
    if (field == null || field === "") {
      onChange(undefined);
    } else {
      const result: AggregationAxis = {
        field: field,
        name: value?.name || "",
        interval: value?.interval,
      };
      const ftype =
        field === "_query" ? "_query" : getField(fields, field)?.type;
      result.field = field;
      if (ftype !== "date") delete result.interval;
      else if (result.interval == null) result.interval = "day";

      if (interval) result.interval = interval;
      onChange(result);
    }
  }

  return (
    <Dropdown
      placeholder="Select field"
      options={fieldoptions}
      value={value?.field}
      value2={value?.interval}
      onChange={({ value, value2 }) =>
        setValues(value as string, value2 as AggregationInterval)
      }
      clearable={clearable}
    />
  );
}
