import { buildColumns } from "@/components/data-table/columns-builder";
import { DataTable } from "@/components/data-table/data-table";
import { type IntentTable, useIntents } from "@/hooks/use-intent";
import type { FetchParams } from "@/types/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/nlp/_intent/intent")({
  component: RouteComponent,
  context: () => ({
    meta: [{ title: "Omnia" }],
    links: [{ rel: "icon", href: "/favicon.ico" }],
  }),
  head: () => ({
    meta: [{ title: "Omnia - Intenções" }],
    links: [{ rel: "icon", href: "/favicon.ico" }],
  }),
});

function RouteComponent() {
  const [params, setParams] = useState<FetchParams>({
    page: 1,
    limit: 10,
    sortBy: undefined,
    sortOrder: undefined,
    search: "",
  });

  const { data, isLoading } = useIntents(params);

  const handleCreateClick = () => {
    // Aqui você pode abrir um dialog/modal para criar novo usuário
  };
  const columns = buildColumns<IntentTable>({
    columns: [
      { key: "name", label: "Nome", sortable: true },
      { key: "description", label: "Descrição", sortable: true },
      {
        key: "createdAt",
        label: "Data de Criação",
        isDate: true,
        sortable: true,
      },
      {
        key: "updatedAt",
        label: "Data de Atualização",
        isDate: true,
        sortable: true,
      },
    ],
    includeActions: true,
    onActionClick: (action, row) => {
      switch (action) {
        case "copyId":
          navigator.clipboard.writeText((row as any).id);
          break;
        case "view":
          console.log("Visualizar", row);
          break;
        case "edit":
          console.log("Editar", row);
          break;
        case "delete":
          console.log("Excluir", row);
          break;
        default:
          break;
      }
    },
  });

  return (
    <DataTable
      columns={columns}
      createButtonLabel="Criar Usuário"
      data={data?.data || []}
      isLoading={isLoading}
      onCreateClick={handleCreateClick}
      onPaginationChange={(page, limit) =>
        setParams((p) => ({ ...p, page, limit }))
      }
      onSearchChange={(search) => setParams((p) => ({ ...p, search }))}
      onSortingChange={(s) => setParams((p) => ({ ...p, ...s }))}
      searchKey="name"
      searchPlaceholder="Buscar por nome..."
      totalCount={data?.pagination.total || 0}
    />
  );
}
