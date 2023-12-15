import {
  AggregateDataPoint,
  AggregateVisualizerProps,
} from "@/amcat/interfaces";
import { axis_label, can_transform, transform_dateparts } from "./lib";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AggregateList({
  data,
  onClick,
  limit,
}: AggregateVisualizerProps) {
  const handleClick = (row: AggregateDataPoint) => {
    const values = data.meta.axes.map((axis) => row[axis.field]);
    onClick(values);
  };
  let d: AggregateDataPoint[] = data.data;

  if (can_transform(data.meta.axes[0].interval)) {
    d = d
      .map((x) => transform_dateparts(x, data.meta.axes[0]))
      .sort((e1, e2) => e1._sort - e2._sort);
  }

  if (limit && d.length > limit) d = d.slice(0, limit);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {data.meta.axes.map((axis, i) => (
            <TableHead key={i}>{axis_label(axis)}</TableHead>
          ))}
          <TableHead>N</TableHead>
          {data.meta.aggregations?.map((metric, i) => (
            <TableHead key={-i}>{metric.name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {d.map((row, i) => {
          return (
            <TableRow key={i}>
              {data.meta.axes.map((axis, j) => {
                if (!axis.name) return null;
                return (
                  <TableCell key={j} onClick={() => handleClick(row)}>
                    {row[axis.name]}
                  </TableCell>
                );
              })}
              <TableCell>{row.n}</TableCell>

              {data.meta.aggregations?.map((metric, i: number) => {
                if (!metric.name) return null;
                return <TableCell key={-i}>{row[metric.name]}</TableCell>;
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
