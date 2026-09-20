import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

// Layout-only route. Everything page-level (head/meta/canonical, component)
// lives in answers.index.tsx so the /answers canonical and meta never leak
// onto the /answers/$slug children — each child emits exactly one canonical.
export const Route = createFileRoute("/answers")({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Answer not found</h1>
      <p className="mt-2 text-muted-foreground">That question does not exist.</p>
      <Link to="/answers" className="mt-4 inline-block text-primary">← All answers</Link>
    </div>
  ),
});
