import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingActions } from "@/components/FloatingActions";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { graphForPage, organizationNode, localBusinessNode, websiteNode, pageScripts } from "@/lib/schema";
import { pageHead } from "@/lib/head";

const GA_ID = import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined;
const GTM_ID = import.meta.env["VITE_GTM_ID"] as string | undefined;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    ...pageHead({
      title: "Ride N Care | Doorstep Bike & Car Service in Bangalore",
      description:
        "Care in every mile. Book verified doorstep bike & car service across Bangalore — OEM parts, written quote, free pickup & drop, 7-day guarantee.",
      path: "/",
    }),
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Ride N Care" },
      { name: "google-site-verification", content: "jhsltMlL-d9OJM2WUXyxdkL6RnJLEpaoQWPUI5qKflc" },
      { name: "theme-color", content: "#0e1c3d" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", href: "/favicon-32x32.png", sizes: "32x32" },
      { rel: "icon", type: "image/png", href: "/favicon-16x16.png", sizes: "16x16" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap",
      },
    ],
    scripts: [
      // One consistent entity graph on every page: Organization + LocalBusiness + WebSite.
      ...pageScripts(graphForPage([organizationNode(), localBusinessNode(), websiteNode()])),
      // GA4 click/conversion events (call, WhatsApp, booking, AI, maps) via data-ctc attributes.
      {
        children: `
(function(){
  function params(el){
    var p = el.getAttribute('data-ctc-params');
    try { return p ? JSON.parse(p) : {}; } catch (e) { return {}; }
  }
  document.addEventListener('click', function(ev){
    var el = ev.target instanceof Element ? ev.target.closest('[data-ctc]') : null;
    if (!el || !window.gtag) return;
    window.gtag('event', el.getAttribute('data-ctc'), Object.assign({ page_path: window.location.pathname }, params(el)));
  }, { passive: true });
})();`,
      },
      // Analytics: set VITE_GA_MEASUREMENT_ID / VITE_GTM_ID to activate.
      ...(GA_ID
        ? [
            { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: true },
            {
              children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
            },
          ]
        : []),
      ...(GTM_ID
        ? [
            {
              children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            },
          ]
        : []),
    ],
  }),
  // Fresh HTML on every deploy: browsers may reuse this response within the
  // session, but shared caches (Cloudflare) must revalidate before reuse.
  // Route-level headers are collected by the SSR handler (getStartResponseHeaders).
  headers: () => ({
    "cache-control": "public, max-age=0, must-revalidate",
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip pb-24 sm:pb-28">
          <SiteHeader />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
          <SiteFooter />
          <FloatingActions />
          <Toaster />
        </div>
      </BookingProvider>

    </QueryClientProvider>
  );
}
