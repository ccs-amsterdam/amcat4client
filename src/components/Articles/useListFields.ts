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
    if (field.type_group === "text") {
      if (field.name !== "title") layout.text.push(field.name);

      const max_snippet = role === "METAREADER" ? field.metareader.max_snippet : undefined;

      if (max_snippet !== undefined || defaultSnippets !== undefined) {
        listField.snippet = {
          nomatch_chars: Math.min(max_snippet?.nomatch_chars ?? Infinity, defaultSnippets?.nomatch_chars ?? Infinity),
          max_matches: Math.min(max_snippet?.max_matches ?? Infinity, defaultSnippets?.max_matches ?? Infinity),
          match_chars: Math.min(max_snippet?.match_chars ?? Infinity, defaultSnippets?.match_chars ?? Infinity),
        };
      }
    } else {
      layout.meta.push(field.name);
    }
    listFields.push(listField);
  });

  return { listFields, layout };
}

export default function useListFields(role: AmcatUserRole, fields: AmcatField[], defaultSnippets?: AmcatSnippet) {
  const { listFields, layout } = useMemo(() => getListFields(role, fields, defaultSnippets), [role, fields]);
  return { listFields, layout };
}
