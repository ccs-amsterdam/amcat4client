import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend, ResponsiveContainer } from "recharts";
import { AggregateVisualizerProps } from "@/interfaces";
import { CustomTooltip } from "./CustomTooltip";
import useCreateChartData from "./useCreateChartData";
import { qualitativeColors } from "./colors";
import { Loading } from "../ui/loading";
import React, { unstable_ConcurrentMode as ConcurrentMode } from "react";

export default function AggregateLineChart({ data, onClick, width, height, limit }: AggregateVisualizerProps) {
  const [chartData, status] = useCreateChartData(data, true);
  console.log(chartData, status);
  if (status === "loading") return <Loading />;
  if (!chartData) return null;
  const colors = qualitativeColors(chartData.columns.length);

  const handleClick = (line: number, point: any) => {
    if (!data.meta.axes[0].name) return;
    // First value is always the payload for primary aggregation axis
    const values = [point.payload[data.meta.axes[0].name]];
    if (data.meta.axes.length !== 1) {
      // Second value is the name of the line clicked on
      values.push(chartData.columns[line]);
    }
    onClick(values);
  };

  if (limit && chartData.columns.length > limit) {
    const counts = Object.fromEntries(chartData.columns.map((c) => [c, 0]));
    const f = data.meta.axes[1].field;
    data.data.forEach((row) => (counts[row[f]] += row.n));
    chartData.columns = Object.keys(counts)
      .sort((k1, k2) => counts[k2] - counts[k1])
      .slice(0, limit);
  }

  if (height == null) height = 300;
  if (width == null) width = "100%";
  return (
    <ResponsiveContainer height={height} width={width} className="text-sm">
      <LineChart data={chartData.d}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={data.meta.axes[0].name} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        {chartData.columns.length > 1 ? <Legend /> : null}
        {chartData.columns.map((column, i) => (
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
