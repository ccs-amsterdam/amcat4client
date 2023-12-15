import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AggregateVisualizerProps } from "@/amcat/interfaces";
import AggregateList from "./AggregateList";
import { can_transform, transform_datepart_value } from "./lib";

export default function AggregateTable({
  data,
  onClick,
  limit,
}: AggregateVisualizerProps) {
  // A table without columns is the same as a list (not trying to get metaphysical here)
  if (data.meta.axes.length === 1)
    return AggregateList({ data, onClick, limit });

  if (data.meta.axes.length !== 2)
    throw new Error(`Cannot handle axes ${data.meta.axes}`);

  // Convert data into set of rows, columns, and [row][col] -> n
  // It feels like this will not win me javascript golf. But it seems to work?
  const primary = data.meta.axes[0];
  const secondary = data.meta.axes[1];
  let rowset = new Set();
  let colset = new Set();
  const d: { [key: string]: { [key: string]: number } } = {};
  data.data.forEach((x) => {
    const row = x[primary.name];
    const col = x[secondary.name];
    rowset.add(row);
    colset.add(col);
    d[row] = { ...d[row], [col]: x["n"] };
  });
  let rows = Array.from(rowset.values()).sort() as string[];
  if (primary.interval && can_transform(primary.interval)) {
    rows = rows.sort(
      (e1, e2) =>
        transform_datepart_value(e1, primary.interval as string)._sort -
        transform_datepart_value(e2, primary.interval as string)._sort
    );
  }
  const cols = Array.from(colset.values()).sort() as string[];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          {cols.map((c) => {
            const label = can_transform(secondary.interval)
              ? transform_datepart_value(c, secondary.interval as string).nl
              : c;
            return <TableHead key={c}>{label}</TableHead>;
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => {
          let label = r;
          const interval = primary.interval;
          if (can_transform(interval)) {
            label = transform_datepart_value(r, interval as string).nl || r;
          }
          return (
            <TableRow key={r}>
              <TableCell>{label}</TableCell>
              {cols.map((c) => (
                <TableCell key={c}>{d[r][c]}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
