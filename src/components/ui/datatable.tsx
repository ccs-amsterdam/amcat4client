"use client";

import {
  ColumnDef,
  FilterFn,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./button";
import { Updater } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  globalFilter?: string;
  pagination?: {
    pageCount: number;
    pageIndex: number;
    nextPage: () => void;
    prevPage: () => void;
  };
  loading?: boolean;
  pageSize?: number;
}

interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  globalFilter,
  pagination,
  loading,
  pageSize = 6,
}: DataTableProps<TData, TValue>) {
  const manualPagination = !!pagination;

  const table = useReactTable({
    data,
    columns,
    // pageCount: manualPagination ? pagination.pageCount : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: manualPagination
      ? { globalFilter, pagination: { pageIndex: pagination.pageIndex, pageSize } }
      : { globalFilter },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const canPaginate = !manualPagination && (table.getCanNextPage() || table.getCanPreviousPage());

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={`${canPaginate ? "flex" : "hidden"} items-center justify-end space-x-2 py-4`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
