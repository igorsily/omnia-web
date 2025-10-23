import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {user?.name}</p>
    </div>
  );
}
