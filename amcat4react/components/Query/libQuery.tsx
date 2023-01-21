import { AmcatQueryTerms } from "../../interfaces";

function format_queries_object(queries: { [label: string]: string }) {
  return Object.keys(queries).map((l) => `${l}=${queries[l]}`);
}

export function queryToString(q?: AmcatQueryTerms, joinby = "\n"): string {
  if (!q) return "";
  const queries = Array.isArray(q) ? q : format_queries_object(q);
  return queries.join(joinby);
}

const labelRE = /(?<=\w\s*)=/;

function queryEntryfromString(
  q: string,
  default_label: string
): [string, string] {
  const m = q.match(labelRE);
  if (!m?.index) return [default_label, q.trim()];
  return [q.slice(0, m.index).trim(), q.slice(m.index + m.length).trim()];
}

function queryObjectFromStrings(queries: string[]): {
  [label: string]: string;
} {
  return Object.fromEntries(
    queries.map((s, i) => queryEntryfromString(s, `q${i}`))
  );
}

export function queryFromString(q: string): AmcatQueryTerms {
  if (!q?.trim()) return {};
  const queries = q.split(/[\n;]/);
  return queryObjectFromStrings(queries);

  //   return q.match(labelRE)
  //     ? queryObjectFromStrings(queries)
  //     : queries.map((s) => s.trim());
}
