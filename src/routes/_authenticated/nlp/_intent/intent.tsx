import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type SortingParams } from "@/components/data-table";
import { useIntents } from "@/hooks/use-intent";
import { columns } from "./_intent-colum";

export const Route = createFileRoute("/_authenticated/nlp/_intent/intent")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useIntents();

  const handleCreateClick = () => {
    // Aqui você pode abrir um dialog/modal para criar novo usuário
    console.log("Abrir dialog de criação");
  };

  const handleSortingChange = (newSorting: SortingParams) => {};

  const handlePaginationChange = (newPage: number, newPageSize: number) => {};

  return (
    <DataTable
      columns={columns}
      createButtonLabel="Criar Usuário"
      data={data?.data || []}
      isLoading={isLoading}
      manualPagination={true}
      manualSorting={true}
      onCreateClick={handleCreateClick}
      onPaginationChange={handlePaginationChange}
      onSortingChange={handleSortingChange}
      searchKey="name"
      searchPlaceholder="Buscar por nome..."
      totalCount={data?.pagination.total}
    />
  );
}
