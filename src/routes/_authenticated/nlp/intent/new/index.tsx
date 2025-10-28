import IntentForm from "@/components/intent-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/nlp/intent/new/")({
  component: RouteComponent,
  context: () => ({
    meta: "Intenteções | Criação",
    links: [{ rel: "icon", href: "/favicon.ico" }],
  }),
  head: () => ({
    meta: [{ title: "Omnia - Intenções" }],
  }),
});

function RouteComponent() {
  return (
    <IntentForm />
  );
}
