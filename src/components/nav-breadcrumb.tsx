import { Link, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "./ui/separator";

export function NavBreadcrumb() {
  const matches = useMatches();

  const breadcrumbMatches = matches.filter(
    (m) => !m.routeId.startsWith("__") && m.pathname !== "/"
  );

  if (breadcrumbMatches.length === 0) {
    return null;
  }

  return (
    <>
      <Separator
        className="mr-2 data-[orientation=vertical]:h-4"
        orientation="vertical"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbMatches.map((match, index) => {
            const isLast = index === breadcrumbMatches.length - 1;
            const path = match.pathname.replace("/_authenticated", "") || "/";

            const lastSegment =
              path.split("/").filter(Boolean).pop() ?? "Início";

            const label =
              lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

            return (
              <BreadcrumbItem key={match.routeId}>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link to={path}>{label}</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
