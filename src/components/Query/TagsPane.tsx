import { AmcatIndex, AmcatQuery } from "amcat4react";
import { useFields } from "amcat4react/dist/Amcat";
import { useState } from "react";

interface TagsPaneProps {
  index: AmcatIndex;
  query: AmcatQuery;
}

export default function TagsPane({ index, query }: TagsPaneProps) {
  const fields = useFields(index);
  const tags =
    fields == null
      ? []
      : fields.filter((f) => f.type == "tag").map((f) => f.name);
  const def = tags.length == 0 ? null : tags.includes("tag") ? "tag" : tags[0];
  const [selectedField, setSelectedField] = useState(def);
  if (fields == null || tags.length == 0) return null;
  if (selectedField == null && def != null) setSelectedField(def);
  console.log({ tags, def, selectedField });
  return <div>{selectedField}</div>;
}
