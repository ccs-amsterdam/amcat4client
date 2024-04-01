import {
  X,
  LineChart,
  BarChart3,
  List,
  Table2,
  Braces,
  Tag,
  CalendarDays,
  FileText,
  Link,
  Globe,
  Fingerprint,
  ToggleLeft,
  Binary,
  Tally5,
} from "lucide-react";

export function DynamicIcon({ type }: { type: string | null }) {
  // display types
  if (type === "line graph") return <LineChart />;
  if (type === "bar chart") return <BarChart3 />;
  if (type === "list") return <List />;
  if (type === "table") return <Table2 />;

  // field types
  if (type === "number" || type === "float" || type === "double") return <Binary />;
  if (type === "object") return <Braces />;
  if (type === "keyword" || type === "tag") return <Tag />;
  if (type === "date") return <CalendarDays />;
  if (type === "text") return <FileText />;
  if (type === "url") return <Link />;
  if (type === "geo") return <Globe />;
  if (type === "id") return <Fingerprint />;
  if (type === "boolean") return <ToggleLeft />;
  if (type === "integer") return <Tally5 />;

  console.error(`Unknown icon type ${type}`);
  return <X />;
}
