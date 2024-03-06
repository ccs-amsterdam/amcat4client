import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AggregateVisualizerProps } from "@/interfaces";
import { qualitativeColors } from "./colors";
import { can_transform, transform_dateparts } from "./lib";
import { CustomTooltip } from "./CustomTooltip";
import { useState } from "react";

export default function AggregateBarChart({ data, createZoom, width, height, limit }: AggregateVisualizerProps) {
  if (!data) return null;
  const [bar, setBar] = useState<string>("");

  const colors = qualitativeColors(data.columns.length);
  const primary = data.axes[0].name;

  const handleClick = (column: string, j: number) => {
    if (createZoom == null) return;

    // First value is always the value for primary axis on the clicked "row"
    const values = [data.rows[j][primary]];
    if (data.axes.length !== 1) {
      if (!bar) return;
      // Second value is the bar clicked on
      values.push(column);
    }

    createZoom(values);
  };

  let sorted;
  if (can_transform(data.axes[0].interval)) {
    sorted = data.rows.map((x) => transform_dateparts(x, data.axes[0])).sort((e1, e2) => e1._sort - e2._sort);
  } else {
    sorted = data.rows.sort((e1, e2) => Number(e2.n) - Number(e1.n));
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
        <Tooltip itemSorter={false} cursor={{ opacity: 0.2 }} content={<CustomTooltip value={bar} />} />
        {data.columns.map((column, i) => (
          <Bar
            key={i}
            className="cursor-pointer"
            type="monotone"
            dataKey={column.name}
            barSize={12}
            fill={colors[i]}
            onMouseEnter={() => setBar(column.name)}
            onClick={(e, j) => handleClick(column.name, j)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
