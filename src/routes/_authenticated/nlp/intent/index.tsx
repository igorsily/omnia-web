import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { buildColumns } from "@/components/data-table/columns-builder";
import { DataTable } from "@/components/data-table/data-table";
import { type IntentTable, useIntents } from "@/hooks/http/use-intent";
export const Route = createFileRoute("/_authenticated/nlp/intent/")({
  component: RouteComponent,
  context: () => ({
    meta: "Intenções",
    links: [{ rel: "icon", href: "/favicon.ico" }],
  }),
  head: () => ({
    meta: [{ title: "Omnia - Intenções" }],
  }),
});

function RouteComponent() {
  const navigate = useNavigate();

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    sortBy: parseAsString.withDefault(""),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
    search: parseAsString.withDefault(""),
  });

  const { data, isLoading } = useIntents(params);

  const handleCreateClick = () => {
    navigate({ to: "/nlp/intent/new" });
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
