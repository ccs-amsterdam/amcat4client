import { AmcatField, AmcatQueryFieldSpec, AmcatSnippet, AmcatUserRole } from "@/interfaces";
import { useEffect, useMemo, useState } from "react";

function getListFields(role: AmcatUserRole, fields: AmcatField[], defaultSnippets?: AmcatSnippet) {
  const listFields: AmcatQueryFieldSpec[] = [];
  const layout: Record<string, string[]> = {
    text: [],
    meta: [],
  };

  fields.forEach((field) => {
    if (role === "NONE") return;
    if (role === "METAREADER" && field.metareader.access === "none") return;

    const listField: AmcatQueryFieldSpec = {
      name: field.name,
    };
    if (field.type === "text") {
      if (field.name !== "title") layout.text.push(field.name);

      const max_snippet = role === "METAREADER" ? field.metareader.max_snippet : undefined;
      listField.snippet = {
        nomatch_chars: max_snippet ? max_snippet.nomatch_chars : defaultSnippets?.nomatch_chars ?? 200,
        max_matches: max_snippet ? max_snippet.max_matches : defaultSnippets?.max_matches ?? 3,
        match_chars: max_snippet ? max_snippet.match_chars : defaultSnippets?.match_chars ?? 50,
      };
    } else {
      layout.meta.push(field.name);
    }
    listFields.push(listField);
  });

  return { listFields, layout };
}

export default function useListFields(role: AmcatUserRole, fields: AmcatField[], defaultSnippets?: AmcatSnippet) {
  const [fieldSelection, setFieldSelection] = useState<AmcatField[]>(() => {
    return fields.filter((field) => field.client_settings.inList);
  });

  useEffect(() => {
    setFieldSelection(fields.filter((field) => field.client_settings.inList));
  }, [fields]);

  const { listFields, layout } = useMemo(
    () => getListFields(role, fieldSelection, defaultSnippets),
    [role, fields, fieldSelection],
  );
  console.log(listFields);
  return { listFields, layout, fieldSelection, setFieldSelection };
}
