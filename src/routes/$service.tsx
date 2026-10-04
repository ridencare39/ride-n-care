import { createFileRoute, Link, Outlet, notFound } from "@tanstack/react-router";
// Layout loader uses the slim summary so the full service content stays in
// the per-route chunks.
import { getServiceSummary, getCarServiceSummary } from "@/lib/service-summary";

export const Route = createFileRoute("/$service")({
  loader: ({ params }) => {
    const service = getServiceSummary(params.service) ?? getCarServiceSummary(params.service);
    if (!service) throw notFound();
    return { service };
  },
  component: () => <Outlet />,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 inline-block text-primary">← Back to home</Link>
    </div>
  ),
});
