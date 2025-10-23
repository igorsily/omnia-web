import type { LoaderFnContext } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

type RouteContext = LoaderFnContext & {
  meta?: {
    requireAuth?: boolean;
    requireGuest?: boolean;
  };
};

export const createAuthContext = async () => {
  const { fetchSession } = useAuthStore.getState();

  await fetchSession();

  return {
    auth: {
      isAuthenticated: useAuthStore.getState().isAuthenticated,
      user: useAuthStore.getState().user,
    },
  };
};

export const authGuard = async (context: RouteContext) => {
  const { auth } = await createAuthContext();
  const meta = context.meta;

  if (meta?.requireAuth && !auth.isAuthenticated) {
    throw redirect({
      to: "/login",
      search: { redirect: location.pathname },
    });
  }

  if (meta?.requireGuest && auth.isAuthenticated) {
    throw redirect({ to: "/dashboard" });
  }

  return { auth };
};
