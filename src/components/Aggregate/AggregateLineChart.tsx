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
  const [page, setPage] = useState(0);
  const pageSize = 250;

  const showData = useMemo(() => {
    if (!data) return null;
    const start = page * pageSize;
    const end = start + pageSize;
    return data.rows.slice(start, end);
  }, [page, data, pageSize]);

  //if (status === "loading") return <Loading />;
  if (!showData || !data) return null;

  const colors = qualitativeColors(data.columns.length);

  const handleClick = (line: number, point: any) => {
    if (!data.axes[0].name) return;
    // First value is always the payload for primary aggregation axis
    const values = [point.payload[data.axes[0].name]];
    if (data.axes.length !== 1) {
      // Second value is the name of the line clicked on
      values.push(data.columns[line]);
    }
    onClick(values);
  };

  const hasPagination = showData.length < data.rows.length;
  if (height == null) height = 300;
  if (width == null) width = "100%";
  return (
    <div>
      <ResponsiveContainer height={height} width={width} className="text-sm">
        <LineChart data={showData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={data.axes[0].name} />
          <YAxis domain={[0, data.domain[1]]} />
          <Tooltip content={<CustomTooltip />} />
          {data.columns.length > 1 ? <Legend /> : null}
          {data.columns.map((column, i) => (
            <Line
              key={column.name + i}
              type="monotone"
              dataKey={column.name}
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
          {page + 1} of {Math.ceil(data.rows.length / pageSize)}
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
