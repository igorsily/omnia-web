"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type SortingParams = {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  isLoading?: boolean;
  onSortingChange?: (sorting: SortingParams) => void;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  totalCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Buscar...",
  onCreateClick,
  createButtonLabel = "Criar Novo",
  isLoading = false,
  onSortingChange,
  onPaginationChange,
  totalCount,
  manualPagination = false,
  manualSorting = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    if (manualSorting && onSortingChange && sorting.length > 0) {
      const sort = sorting[0];
      onSortingChange({
        sortBy: sort.id,
        sortOrder: sort.desc ? "desc" : "asc",
      });
    } else if (manualSorting && onSortingChange && sorting.length === 0) {
      onSortingChange({});
    }
  }, [sorting, manualSorting, onSortingChange]);

  React.useEffect(() => {
    if (manualPagination && onPaginationChange) {
      onPaginationChange(pagination.pageIndex, pagination.pageSize);
    }
  }, [pagination, manualPagination, onPaginationChange]);

  const table = useReactTable({
    data,
    columns,
    pageCount:
      manualPagination && totalCount
        ? Math.ceil(totalCount / pagination.pageSize)
        : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: manualSorting ? undefined : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination,
    manualSorting,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const getPageNumbers = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="w-full space-y-4">
      {/* Header com botão de criar e busca */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {onCreateClick && (
            <Button className="gap-2" onClick={onCreateClick}>
              <Plus className="h-4 w-4" />
              {createButtonLabel}
            </Button>
          )}
        </div>

        {searchKey && (
          <div className="relative max-w-sm flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
            />
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">Linhas por página</p>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            value={`${table.getState().pagination.pageSize}`}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="sm"
            variant="outline"
          >
            Anterior
          </Button>

          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  className="px-2 text-muted-foreground text-sm"
                  key={`ellipsis-${index}`}
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage =
              table.getState().pagination.pageIndex + 1 === pageNumber;

            return (
              <Button
                className="h-8 w-8 p-0"
                key={pageNumber}
                onClick={() => table.setPageIndex(pageNumber - 1)}
                size="sm"
                variant={isCurrentPage ? "default" : "outline"}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="sm"
            variant="outline"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper para criar coluna com sort
export function createSortableColumn<TData>(
  accessorKey: string,
  header: string
): ColumnDef<TData> {
  return {
    accessorKey,
    header: ({ column }) => (
      <Button
        className="-ml-4 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        {header}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  };
}
