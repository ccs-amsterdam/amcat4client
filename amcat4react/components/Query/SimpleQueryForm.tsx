import { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import { useFields, getField } from "../../Amcat";
import FilterPicker from "./FilterPicker";
import { queryFromString, queryToString } from "./libQuery";
import { QueryFormProps } from "./QueryForm";
import AddFilterButton, { fieldOptions } from "./AddFilterButton";

export default function SimpleQueryForm({
  user,
  index,
  value,
  onSubmit,
}: QueryFormProps) {
  const fields = useFields(user, index);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (!value?.queries || Object.keys(value.queries).length === 0) setQ("");
    else setQ(queryToString(value.queries, "; "));
  }, [value?.queries]);

  if (!index || !fields) return null;

  function deleteFilter(name: string) {
    const f = { ...value.filters };
    delete f[name];
    onSubmit({ ...value, filters: f });
  }
  function addFilter(name: string) {
    const filters = value?.filters || {};
    onSubmit({ ...value, filters: { ...filters, [name]: {} } });
  }

  function handleKeydown(e: any) {
    if (e.key === "Enter") onSubmit({ ...value, queries: queryFromString(q) });
  }

  return (
    <div className="singlequeryform">
      <Input
        icon="search"
        iconPosition="left"
        className="querystring"
        placeholder="search"
        value={q}
        onChange={(_, { value }) => setQ(value)}
        onKeyDown={handleKeydown}
      />

      {Object.keys(value?.filters || {}).map((f, i) => (
        <FilterPicker
          basic
          circular
          key={i}
          user={user}
          index={index}
          field={getField(fields, f)}
          value={value?.filters?.[f]}
          onChange={(newval) =>
            onSubmit({ ...value, filters: { ...value?.filters, [f]: newval } })
          }
          onDelete={() => deleteFilter(f)}
        />
      ))}
      <AddFilterButton
        options={fieldOptions(fields, value)}
        onClick={addFilter}
      />
    </div>
  );
}
