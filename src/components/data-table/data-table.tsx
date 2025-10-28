import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
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
import { useDebounce } from "@/hooks/use-debounce";

export type SortingParams = {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  isLoading?: boolean;
  searchKey?: string;
  searchPlaceholder?: string;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  onSearchChange?: (value: string) => void;
  onSortingChange?: (sorting: SortingParams) => void;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
};

export function DataTable<
  // biome-ignore lint/suspicious/noExplicitAny: This is a generic component
  TData extends { id?: string } & Record<string, any>,
  TValue,
>({
  columns,
  data,
  totalCount,
  isLoading = false,
  searchKey,
  searchPlaceholder = "Buscar...",
  onCreateClick,
  createButtonLabel = "Criar Novo",
  onSearchChange,
  onSortingChange,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const debouncedSearchTerm = useDebounce(search, 500); // 500ms debounce time
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }[]>(
    []
  );

  const paginationChangeRef = React.useRef(onPaginationChange);
  const searchChangeRef = React.useRef(onSearchChange);
  const sortingChangeRef = React.useRef(onSortingChange);

  React.useEffect(() => {
    paginationChangeRef.current?.(pageIndex + 1, pageSize);
  }, [pageIndex, pageSize]);

  React.useEffect(() => {
    searchChangeRef.current?.(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
    },

    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;

      setSorting(next);

      const sort = next[0];
      if (sort) {
        sortingChangeRef.current?.({
          sortBy: sort.id,
          sortOrder: sort.desc ? "desc" : "asc",
        });
      } else {
        sortingChangeRef.current?.({ sortBy: undefined, sortOrder: undefined });
      }
    },
  });

  const totalPages = Math.max(1, table.getPageCount());

  const getPageNumbers = () => {
    const currentPage = pageIndex + 1;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  let tableContent: React.ReactNode;

  if (isLoading) {
    tableContent = (
      <TableRow>
        <TableCell className="h-24 text-center" colSpan={columns.length}>
          Carregando...
        </TableCell>
      </TableRow>
    );
  } else if (table.getRowModel().rows?.length) {
    const rows = table.getRowModel().rows;

    tableContent = rows.map((row) => (
      <TableRow key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  } else {
    tableContent = (
      <TableRow>
        <TableCell className="h-24 text-center" colSpan={columns.length}>
          Nenhum resultado encontrado.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header com botão e busca */}
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
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder={searchPlaceholder}
              value={search}
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
          <TableBody>{tableContent}</TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">Linhas por página</p>
          <Select
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
            value={`${pageSize}`}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
            size="sm"
            variant="outline"
          >
            Anterior
          </Button>

          {getPageNumbers().map((page) =>
            page === "..." ? (
              <span className="px-2 text-muted-foreground text-sm" key={page}>
                ...
              </span>
            ) : (
              <Button
                className="h-8 w-8 p-0"
                key={page as number}
                onClick={() => {
                  setPageIndex((page as number) - 1);
                }}
                size="sm"
                variant={pageIndex + 1 === page ? "default" : "outline"}
              >
                {page}
              </Button>
            )
          )}

          <Button
            disabled={pageIndex + 1 >= totalPages}
            onClick={() => setPageIndex((p) => Math.min(p + 1, totalPages - 1))}
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
