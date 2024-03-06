import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { AggregateDataPoint, ChartData } from "@/interfaces";

interface Pagination {
  page: number;
  pageSize: number;
  n: number;
  setPage: (page: number) => void;
}

export function useAggregatePagination(data?: ChartData, pageSize: number = 5) {
  const [page, setPage] = useState(0);

  const paginatedData: ChartData | undefined = useMemo(() => {
    if (!data) return data;
    const start = page * pageSize;
    const end = start + pageSize;
    const rows = data.rows.slice(start, end);
    return { ...data, rows };
  }, [page, data, pageSize]);

  return { paginatedData, pagination: { page, n: data?.rows.length || 0, pageSize, setPage } };
}

interface Props {
  data: ChartData;
  pagination: Pagination;
}

export default function AggregatePagination({ data, pagination }: Props) {
  const hasPagination = data.rows.length < pagination.n;

  return (
    <div
      className={`ml-16 grid select-none grid-cols-[1fr,1fr,1fr] items-center ${hasPagination ? "block" : "hidden"}`}
    >
      <Button
        variant="ghost"
        className="flex gap-3"
        onClick={() => pagination.setPage(pagination.page - 1)}
        disabled={pagination.page === 0}
      >
        <ArrowLeft />
        Previous
      </Button>
      <div className="mx-auto px-3">
        {pagination.page + 1} of {Math.ceil(pagination.n / pagination.pageSize)}
      </div>
      <Button
        variant="ghost"
        className="flex gap-3"
        onClick={() => pagination.setPage(pagination.page + 1)}
        disabled={data.rows.length < pagination.pageSize}
      >
        Next
        <ArrowRight />
      </Button>
    </div>
  );
}
