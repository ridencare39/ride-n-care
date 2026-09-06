import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/guides")({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Guide not found</h1>
      <p className="mt-2 text-muted-foreground">That guide does not exist.</p>
      <Link to="/guides" className="mt-4 inline-block text-primary">← All guides</Link>
    </div>
  ),
});
