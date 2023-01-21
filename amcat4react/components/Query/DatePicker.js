// For some reason, type script does not like this one...
import SemanticDatepicker from "react-semantic-ui-datepickers";

export default function DatePicker({ label, value, onChange }) {
  return (
    <SemanticDatepicker
      label={<b>{label}</b>}
      type="basic"
      value={value ? new Date(value) : ""}
      format="YYYY-MM-DD"
      onChange={(e, d) => {
        onChange(d.value);
      }}
      style={{ height: "1em", padding: "0" }}
    />
  );
}
