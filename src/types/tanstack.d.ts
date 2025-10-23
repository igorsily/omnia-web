import "@tanstack/react-router";

declare module "@tanstack/react-router" {
  // biome-ignore lint/nursery/useConsistentTypeDefinitions: Chatooooooo
  interface FileRouteTypes {
    meta: {
      breadcrumb?: string | ((params: Record<string, string>) => string);
    };
  }
}
