import {
  X,
  LineChart,
  BarChart3,
  List,
  Table2,
  Hash,
  Braces,
  Tag,
  CalendarDays,
  FileText,
  Link,
  Globe,
  Fingerprint,
} from "lucide-react";

export type Icon =
  | "line graph"
  | "bar chart"
  | "list"
  | "table"
  | "number"
  | "object"
  | "keyword"
  | "date"
  | "text"
  | "geo"
  | "url"
  | "boolean"
  | "vector"
  | "id";

export function DynamicIcon({ type }: { type: Icon | null }) {
  // display types
  if (type === "line graph") return <LineChart />;
  if (type === "bar chart") return <BarChart3 />;
  if (type === "list") return <List />;
  if (type === "table") return <Table2 />;

  // field types
  if (type === "number") return <Hash />;
  if (type === "object") return <Braces />;
  if (type === "keyword") return <Tag />;
  if (type === "date") return <CalendarDays />;
  if (type === "text") return <FileText />;
  if (type === "url") return <Link />;
  if (type === "geo") return <Globe />;
  if (type === "id") return <Fingerprint />;

  console.error(`Unknown icon type ${type}`);
  return <X />;
}
