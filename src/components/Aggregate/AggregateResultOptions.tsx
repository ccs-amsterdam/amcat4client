import { AggregationAxis, AggregationInterval, Amcat } from "amcat4react";
import { getField } from "amcat4react/dist/Amcat";
import { DisplayOption } from "amcat4react/dist/interfaces";
import React, { useState } from "react";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectIndex } from "../Menu/LoginSlice";
import { selectOptions, setAggregationOptions } from "./AggregateSlice";
import "./Aggregation.scss";

const INTERVALS = ["day", "week", "month", "quarter", "year"];

const DISPLAY: {
  value: DisplayOption;
  text: string;
  icon: SemanticICONS;
}[] = [
  { value: "linechart", text: "Line Graph", icon: "line graph" },
  { value: "barchart", text: "Bar Chart", icon: "chart bar" },
  { value: "list", text: "List", icon: "list layout" },
];

export default function AggregateResultOptions() {
  const reduxOptions = useAppSelector(selectOptions) || {};
  const [options, setOptions] = useState(reduxOptions);
  const dispatch = useAppDispatch();
  function setDisplay(value: DisplayOption) {
    setOptions({ ...options, display: value });
  }
  function setAxis(i: number, newval?: AggregationAxis) {
    const axes = options.axes == null ? [] : [...options.axes];
    if (newval == null) axes.splice(i, 1);
    else axes[i] = newval;
    setOptions({ ...options, axes });
  }
  function submit() {
    if (options != null) dispatch(setAggregationOptions(options));
  }

  const displayoptions = DISPLAY.map((d, i) => (
    <React.Fragment key={d.value}>
      {i === 0 ? null : <Button.Or key={"or_" + d.value} />}

      <Button
        key={d.value}
        active={d.value === options.display}
        toggle
        onClick={() => setDisplay(d.value)}
      >
        <Icon key={d.value} name={d.icon} />
        {d.text}
      </Button>
    </React.Fragment>
  ));

  return (
    <div className="aggregateoptions">
      <div className="aggregateoptionsrow">
        <div className="label">Display as</div>
        <div className="option">
          <Button.Group>{displayoptions}</Button.Group>
        </div>
      </div>
      <div className="aggregateoptionsrow">
        <div className="label">Primary axis</div>
        <div className="option">
          <AxisPicker
            value={options.axes?.[0]}
            onChange={(newval) => setAxis(0, newval)}
          />
        </div>
      </div>
      <div className="aggregateoptionsrow">
        <div className="label">Secondary axis</div>
        <div className="option">
          <AxisPicker
            value={options.axes?.[1]}
            onChange={(newval) => setAxis(1, newval)}
            clearable
          />
        </div>
      </div>

      <Button primary onClick={submit}>
        Submit
      </Button>
    </div>
  );
}

interface AxisPickerProps {
  value?: AggregationAxis;
  onChange: (value?: AggregationAxis) => void;
  clearable?: boolean;
}
function AxisPicker({ value, onChange, clearable = false }: AxisPickerProps) {
  const index = useAppSelector(selectIndex);
  const fields = Amcat.useFields(index);
  const axes = useAppSelector(selectOptions).axes || [];

  const fieldoptions = fields
    .filter((f) => ["date", "keyword"].includes(f.type))
    .filter(
      // don't include 'other' field
      (f) =>
        f.name === value?.field || !axes.map((x) => x.field).includes(f.name)
    )
    .map((f) => ({
      text: f.name,
      value: f.name,
      key: f.name,
      icon: Amcat.getFieldTypeIcon(f.type),
    }));

  function setField(field: string) {
    if (field == null) {
      onChange(undefined);
    } else {
      const result: AggregationAxis = { ...value, field: field };
      const ftype = getField(fields, field).type;
      result.field = field;
      if (ftype !== "date") delete result.interval;
      else if (result.interval == null) result.interval = "day";
      onChange(result);
    }
  }
  function setInterval(interval: AggregationInterval) {
    // Cannot set interval without field
    if (value != null) onChange({ ...value, interval });
  }

  const field = value && Amcat.getField(fields, value.field);
  const intervaloptions =
    field?.type === "date" &&
    INTERVALS.map((i) => ({ key: i, text: i, value: i }));

  return (
    <>
      <Dropdown
        selection
        clearable={clearable}
        options={fieldoptions}
        value={value?.field}
        onChange={(_, { value }) => setField(value as string)}
      />
      {!intervaloptions ? null : (
        <React.Fragment>
          interval:{" "}
          <Dropdown
            selection
            options={intervaloptions}
            value={value?.interval}
            onChange={(_, { value }) =>
              setInterval(value as AggregationInterval)
            }
          />
        </React.Fragment>
      )}
    </>
  );
}
