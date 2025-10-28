import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ColumnConfig<TData> = {
  key: keyof TData & string;
  label: string;
  isDate?: boolean;
  sortable?: boolean;
  format?: (value: unknown, row: TData) => React.ReactNode;
};

type BuildColumnsOptions<TData> = {
  columns: ColumnConfig<TData>[];
  includeActions?: boolean;
  onActionClick?: (action: string, row: TData) => void;
};

/**
 * Gera dinamicamente colunas com sorting, formatação e ações.
 */
export function buildColumns<TData>({
  columns,
  includeActions = false,
  onActionClick,
}: BuildColumnsOptions<TData>): ColumnDef<TData>[] {
  const builtColumns: ColumnDef<TData>[] = columns.map((col) => ({
    accessorKey: col.key,
    header: ({ column }) =>
      col.sortable ? (
        <SortableHeader column={column} label={col.label} />
      ) : (
        <span>{col.label}</span>
      ),
    cell: ({ row }) => {
      const value = row.getValue(col.key);
      if (col.format) {
        return col.format(value, row.original);
      }

      if (col.isDate && typeof value === "string") {
        return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
      }
      return value as React.ReactNode;
    },
  }));

  if (includeActions) {
    builtColumns.push({
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onActionClick?.("copyId", data)}>
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onActionClick?.("view", data)}>
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onActionClick?.("edit", data)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onActionClick?.("delete", data)}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return builtColumns;
}

/**
 * Header sortável reutilizável
 */
function SortableHeader<TData>({
  column,
  label,
}: {
  column: any;
  label: string;
}) {
  const sortState = column.getIsSorted(); // 'asc' | 'desc' | false

  let sortedIcon: React.ReactNode = (
    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
  );

  if (sortState === "asc") {
    sortedIcon = <ArrowUp className="ml-2 h-4 w-4" />;
  }

  if (sortState === "desc") {
    sortedIcon = <ArrowDown className="ml-2 h-4 w-4" />;
  }

  return (
    <Button
      className="-ml-4 h-8"
      onClick={() => column.toggleSorting(sortState === "asc")}
      variant="ghost"
    >
      {label}
      {sortedIcon}
    </Button>
  );
}
