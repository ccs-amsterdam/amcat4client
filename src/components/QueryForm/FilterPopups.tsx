import { useFieldValues } from "@/api/fieldValues";
import { AmcatField, AmcatFilter, AmcatIndexName, DateFilter } from "@/interfaces";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "./DatePicker";
import { MiddlecatUser } from "middlecat-react";

interface FilterPopupProps {
  user: MiddlecatUser;
  index: AmcatIndexName;
  field: AmcatField | undefined;
  value: AmcatFilter | undefined;
  onChange: (value: AmcatFilter) => void;
}

export function filterLabel(name: string, field: AmcatField | undefined, filter: AmcatFilter | undefined) {
  if (filter == null) return name;

  let values = "";
  if (field?.type === "date") {
    if (filter.gte && filter.lte) values = `${filter.gte} / ${filter.lte}`;
    if (filter.gte && !filter.lte) values = `from ${filter.gte}`;
    if (filter.lte && !filter.gte) values = `until ${filter.lte}`;
  } else {
    if (filter.values) {
      values = `(${filter.values.length})`;
    }
  }

  if (values)
    return (
      <div className="flex w-full items-center gap-2">
        <div className="font-bold">{name}</div>
        {values}
      </div>
    );

  return (
    <span>
      select <b>{name}</b>
    </span>
  );
}

export function FilterPopup({ user, index, field, value, onChange }: FilterPopupProps) {
  if (field == null || value == null) return null;

  if (field.type === "date") return DateRangePopup({ user, index, field, value, onChange });
  return KeywordPopup({ user, index, field, value, onChange });
}

export function KeywordPopup({ user, index, field, value, onChange }: FilterPopupProps) {
  if (field == null || value == null) return null;

  const { data: fieldValues } = useFieldValues(user, index, field.name);
  const selected = value?.values || [];
  if (!fieldValues || fieldValues.length === 0) return null;

  function handleChange(checked: boolean, v: string) {
    if (checked && !selected.includes(v)) onChange({ values: [...selected, v] });
    if (!checked && selected.includes(v)) onChange({ values: selected.filter((x) => x !== v) });
  }

  return (
    <div>
      {fieldValues.map((v, i) => {
        const checked = selected.includes(v);
        return (
          <div key={v + i} className="flex items-center gap-3 py-1" onClick={() => handleChange(!checked, v)}>
            <Checkbox key={i} checked={checked} className="h-5 w-5" />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {v}{" "}
            </label>
          </div>
        );
      })}
    </div>
  );
}

function date2str(date: Date, ifNone = ""): string {
  if (!date) return ifNone;
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const year = date.getFullYear();
  return year + "-" + month + "-" + day;
}

export function DateRangePopup({ user, index, field, value, onChange }: FilterPopupProps) {
  if (field == null || value == null) return null;

  const { data: fieldValues } = useFieldValues(user, index, field.name);
  if (!fieldValues || fieldValues.length === 0) return null;

  const handleChange = (key: keyof DateFilter, newval: Date | undefined) => {
    let result = { ...value };
    if (!newval) {
      delete result[key];
    } else result[key] = date2str(newval);
    onChange(result);
  };
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <DatePicker
        label={"from"}
        value={value.gte ? new Date(value.gte) : undefined}
        onChange={(newval) => handleChange("gte", newval)}
      />
      <DatePicker
        label={"to"}
        value={value.lte ? new Date(value.lte) : undefined}
        onChange={(newval) => handleChange("lte", newval)}
      />
    </div>
  );
}
