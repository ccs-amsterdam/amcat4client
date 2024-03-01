import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AggregateVisualizerProps } from "@/interfaces";
import { qualitativeColors } from "./colors";
import { can_transform, transform_dateparts } from "./lib";
import { CustomTooltip } from "./CustomTooltip";
import useCreateChartData from "./useCreateChartData";

export default function AggregateBarChart({ data, onClick, width, height, limit }: AggregateVisualizerProps) {
  const [chartData, status] = useCreateChartData(data, true);

  if (!chartData) return null;

  const colors = qualitativeColors(chartData.columns.length);
  const primary = data.meta.axes[0].name;

  const handleClick = (column: string, j: number) => {
    if (onClick == null) return;

    // First value is always the value for primary axis on the clicked "row"
    const values = [chartData.d[j][primary]];
    if (data.meta.axes.length !== 1) {
      // Second value is the column clicked on
      values.push(column);
    }
    onClick(values);
  };

  let sorted;
  if (can_transform(data.meta.axes[0].interval)) {
    sorted = chartData.d.map((x) => transform_dateparts(x, data.meta.axes[0])).sort((e1, e2) => e1._sort - e2._sort);
  } else {
    sorted = chartData.d.sort((e1, e2) => e2.n - e1.n);
  }
  if (limit && sorted.length > limit) sorted = sorted.slice(0, limit);
  if (height == null) height = Math.max(250, sorted.length * 30);
  if (width == null) width = "100%";

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={sorted} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis type="category" dataKey={primary} width={250} interval={0} />
        <XAxis type="number" />
        <Tooltip content={<CustomTooltip />} />
        {chartData.columns.map((column, i) => (
          <Bar
            key={i}
            type="monotone"
            dataKey={column}
            barSize={12}
            fill={colors[i]}
            onClick={(e, j) => handleClick(column, j)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
