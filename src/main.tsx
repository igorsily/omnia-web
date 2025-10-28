import { TanStackDevtools } from '@tanstack/react-devtools';
import { FormDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

type RouterContext = {
  auth: {
    isAuthenticated: boolean;
    user: unknown;
  };
};

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <Loader />,
  context: {
    auth: {
      isAuthenticated: false,
      user: null,
    },
  } satisfies RouterContext,
});

declare module "@tanstack/react-router" {
  // biome-ignore lint/nursery/useConsistentTypeDefinitions: deixa de ser chato
  interface Register {
    router: typeof router;
  }
}

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
            placeholderData: (prev) => prev,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      <TanStackDevtools plugins={[
        {
          name: 'TanStack Query',
          render: <ReactQueryDevtoolsPanel />,
        },
        // {
        //   name: 'TanStack Router',
        //   render: <TanStackRouterDevtoolsPanel />,
        // },
        FormDevtoolsPlugin()
      ]} />
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("app");
if (!rootElement) {
  throw new Error("Root element not found");
}
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
