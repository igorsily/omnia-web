import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { createAuthContext } from "@/guards/route-guard";
import "../index.css";

type RouterContext = {
  meta: {
    breadcrumb?: string | ((params: Record<string, string>) => string);
  }
  auth: {
    isAuthenticated: boolean;
    user: unknown;
  };
};

export const Route = createRootRouteWithContext<RouterContext>()({
  async beforeLoad() {
    return await createAuthContext();
  },
  component: RootComponent,
  head: () => ({
    meta: [{ title: "Omnia" }],
    links: [{ rel: "icon", href: "/favicon.ico" }],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <Outlet />
        <Toaster position="top-right" />
      </ThemeProvider>
    </>
  );
}
