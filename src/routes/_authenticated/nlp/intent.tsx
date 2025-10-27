import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/nlp/intent")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/nlp/intent"!</div>;
}
