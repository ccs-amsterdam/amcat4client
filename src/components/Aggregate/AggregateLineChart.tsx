import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend, ResponsiveContainer } from "recharts";
import { AggregateVisualizerProps } from "@/interfaces";
import { CustomTooltip } from "./CustomTooltip";
import useCreateChartData from "./useCreateChartData";
import { qualitativeColors } from "./colors";
import { Loading } from "../ui/loading";
import { useMemo, useState } from "react";
import { ArrowBigRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface LineClickArea {}

export default function AggregateLineChart({ data, createZoom, width, height, limit }: AggregateVisualizerProps) {
  const [page, setPage] = useState(0);
  const pageSize = 250;
  const [line, setLine] = useState<string>("");
  // const [lineClickArea, setLineClickArea] = useState;

  const showData = useMemo(() => {
    if (!data) return null;
    const start = page * pageSize;
    const end = start + pageSize;
    return data.rows.slice(start, end);
  }, [page, data, pageSize]);

  //if (status === "loading") return <Loading />;
  if (!showData || !data) return null;

  const colors = qualitativeColors(data.columns.length);

  const handleClick = (x: number) => {
    if (!data.axes[0].name) return;

    // First value is always the payload for primary aggregation axis
    const values: (number | string)[] = [data.rows[x][data.axes[0].name]];
    if (data.axes.length !== 1) {
      if (!line) return;
      // Second value is the name of the line clicked on
      values.push(line);
    }

    createZoom(values);
  };

  // function closestOnYAxis() {
  //   if (!coordinate?.y || !viewBox?.y || !viewBox.height || !payload) return 0;
  //   const yValue = (coordinate?.y - viewBox.y) / viewBox.height;
  //   const bins = 1 / payload.length;
  //   const itemI Math.min(Math.floor(yValue / bins), payload.length - 1);
  //   return
  // }

  const hasPagination = showData.length < data.rows.length;
  if (height == null) height = 300;
  if (width == null) width = "100%";
  return (
    <div>
      <ResponsiveContainer height={height} width={width} className="text-sm">
        <LineChart
          style={{ cursor: "pointer" }}
          data={showData}
          onClick={(e) => handleClick(e.activeTooltipIndex || 0)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={data.axes[0].name} />
          <YAxis domain={[0, data.domain[1]]} />
          <Tooltip trigger={"hover"} content={<CustomTooltip value={line} onChangeGroup={setLine} />} />
          {data.columns.length > 1 ? <Legend /> : null}
          {data.columns.map((column, i) => (
            <Line
              key={column.name + i}
              type="monotone"
              dataKey={column.name}
              stroke={colors[i]}
              activeDot={{ style: { cursor: "pointer" } }}
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
