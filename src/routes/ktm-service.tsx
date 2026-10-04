import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBrandService } from "@/lib/brand-services";
import { pageHead, pageScripts } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, faqNode } from "@/lib/schema";
import { BrandServiceView } from "@/components/BrandServiceView";

export const Route = createFileRoute("/ktm-service")({
  head: () => {
    const s = getBrandService("ktm-service");
    if (!s) return { meta: [{ title: "Page not found" }] };
    return {
      ...pageHead({
        title: s.title,
        description: s.description,
        path: `/${s.slug}`,
        extraMeta: [
          { property: "og:title", content: s.title },
          { property: "og:description", content: s.description },
        ],
      }),
      scripts: pageScripts(
        graphForPage([
          serviceNode({
            slug: s.slug,
            name: s.name,
            serviceType: `Doorstep ${s.brand} service`,
            description: s.summary,
          }),
          breadcrumbNode([
            ["Home", "/"],
            ["Bike service", "/bikes"],
            [s.name, `/${s.slug}`],
          ]),
          faqNode(s.faqs),
        ]),
      ),
    };
  },
  loader: () => {
    const s = getBrandService("ktm-service");
    if (!s) throw notFound();
    return { s };
  },
  component: () => {
    const { s } = Route.useLoaderData() as { s: NonNullable<ReturnType<typeof getBrandService>> };
    return <BrandServiceView s={s} />;
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary">← Back to home</Link>
    </div>
  ),
});
