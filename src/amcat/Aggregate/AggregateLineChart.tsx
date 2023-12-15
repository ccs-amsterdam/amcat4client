import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AggregateVisualizerProps } from "@/amcat/interfaces";
import { qualitativeColors } from "./colors";
import { createChartData } from "./lib";
import { CustomTooltip } from "./CustomTooltip";

export default function AggregateLineChart({
  data,
  onClick,
  width,
  height,
  limit,
}: AggregateVisualizerProps) {
  let { d, columns } = createChartData(data);
  const colors = qualitativeColors(columns.length);

  const handleClick = (line: number, point: any) => {
    if (!data.meta.axes[0].name) return;
    // First value is always the payload for primary aggregation axis
    const values = [point.payload[data.meta.axes[0].name]];
    if (data.meta.axes.length !== 1) {
      // Second value is the name of the line clicked on
      values.push(columns[line]);
    }
    onClick(values);
  };

  if (limit && columns.length > limit) {
    const counts = Object.fromEntries(columns.map((c) => [c, 0]));
    const f = data.meta.axes[1].field;
    data.data.forEach((row) => (counts[row[f]] += row.n));
    columns = Object.keys(counts)
      .sort((k1, k2) => counts[k2] - counts[k1])
      .slice(0, limit);
  }

  if (height == null) height = 300;
  if (width == null) width = "100%";
  return (
    <ResponsiveContainer height={height} width={width} className="text-sm">
      <LineChart data={d}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={data.meta.axes[0].name} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        {columns.length > 1 ? <Legend /> : null}
        {columns.map((column, i) => (
          <Line
            key={column + i}
            type="monotone"
            dataKey={column}
            stroke={colors[i]}
            activeDot={{ onClick: (e, j) => handleClick(i, j) }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
