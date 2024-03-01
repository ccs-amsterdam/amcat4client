import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend, ResponsiveContainer } from "recharts";
import { AggregateVisualizerProps } from "@/interfaces";
import { CustomTooltip } from "./CustomTooltip";
import useCreateChartData from "./useCreateChartData";
import { qualitativeColors } from "./colors";
import { Loading } from "../ui/loading";
import { useMemo, useState } from "react";
import { ArrowBigRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function AggregateLineChart({ data, onClick, width, height, limit }: AggregateVisualizerProps) {
  const [chartData, status] = useCreateChartData(data, true);
  const [page, setPage] = useState(0);
  const pageSize = 250;

  const maxValue = useMemo(() => {
    let max = 0;
    if (!chartData) return max;
    for (let row of chartData.d) {
      for (let column of chartData.columns) {
        max = Math.max(max, row[column]);
      }
    }
    return max;
  }, [chartData]);
  const showData = useMemo(() => {
    if (!chartData) return null;
    const start = page * pageSize;
    const end = start + pageSize;
    return chartData.d.slice(start, end);
  }, [page, chartData, pageSize]);

  if (status === "loading") return <Loading />;
  if (!showData || !chartData) return null;

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

  const hasPagination = showData.length < chartData.d.length;
  if (height == null) height = 300;
  if (width == null) width = "100%";
  return (
    <div>
      <ResponsiveContainer height={height} width={width} className="text-sm">
        <LineChart data={showData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={data.meta.axes[0].name} />
          <YAxis domain={[0, maxValue]} />
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
      <div
        className={`ml-16 grid select-none grid-cols-[1fr,1fr,1fr] items-center ${hasPagination ? "block" : "hidden"}`}
      >
        <Button variant="ghost" className="flex gap-3" onClick={() => setPage(page - 1)} disabled={page === 0}>
          <ArrowLeft />
          Previous
        </Button>
        <div className="mx-auto px-3">
          {page + 1} of {Math.ceil(chartData.d.length / pageSize)}
        </div>
        <Button
          variant="ghost"
          className="flex gap-3"
          onClick={() => setPage(page + 1)}
          disabled={showData.length < pageSize}
        >
          Next
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
