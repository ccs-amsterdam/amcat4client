import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AggregateVisualizerProps } from "@/amcat/interfaces";
import { qualitativeColors } from "./colors";
import { can_transform, createChartData, transform_dateparts } from "./lib";
import { CustomTooltip } from "./CustomTooltip";

export default function AggregateBarChart({
  data,
  onClick,
  width,
  height,
  limit,
}: AggregateVisualizerProps) {
  const { d, columns } = createChartData(data);
  const colors = qualitativeColors(columns.length);
  const primary = data.meta.axes[0].name;

  const handleClick = (column: string, j: number) => {
    if (onClick == null) return;

    // First value is always the value for primary axis on the clicked "row"
    const values = [d[j][primary]];
    if (data.meta.axes.length !== 1) {
      // Second value is the column clicked on
      values.push(column);
    }
    onClick(values);
  };
  let sorted;
  if (can_transform(data.meta.axes[0].interval)) {
    sorted = d
      .map((x) => transform_dateparts(x, data.meta.axes[0]))
      .sort((e1, e2) => e1._sort - e2._sort);
  } else {
    sorted = d.sort((e1, e2) => e2.n - e1.n);
  }
  if (limit && sorted.length > limit) sorted = sorted.slice(0, limit);
  if (height == null) height = Math.max(250, sorted.length * 30);
  if (width == null) width = "100%";

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={sorted} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis type="category" dataKey={primary} width={150} />
        <XAxis type="number" />
        <Tooltip content={<CustomTooltip />} />
        {columns.map((column, i) => (
          <Bar
            key={i}
            type="monotone"
            dataKey={column}
            fill={colors[i]}
            onClick={(e, j) => handleClick(column, j)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
