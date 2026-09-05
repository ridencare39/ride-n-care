import { createFileRoute, Link, Outlet, notFound } from "@tanstack/react-router";
import { getService } from "@/lib/services";

export const Route = createFileRoute("/$service")({
  loader: ({ params }) => {
    const service = getService(params.service);
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
