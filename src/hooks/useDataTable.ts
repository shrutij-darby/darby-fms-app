import { useState, useMemo } from 'react';
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
} from '@tanstack/react-table';

interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export function useDataTable<TData>({
  data,
  columns,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
}: UseDataTableProps<TData>) {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Memoize data and columns to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  // Create table instance
  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      pagination,
    },
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    table,
    globalFilter,
    setGlobalFilter,
    pageSizeOptions,
  };
}
