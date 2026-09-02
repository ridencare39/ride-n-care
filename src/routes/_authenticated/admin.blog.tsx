import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { POST_CATEGORIES, slugify, type Post } from "@/lib/blog";
import {
  adminDeletePost,
  adminListPosts,
  adminSavePost,
  claimAdmin,
  getAdminStatus,
} from "@/lib/blog.functions";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  head: () => ({
    meta: [
      { title: "Blog Editor | Ride N Care Admin" },
      { name: "description", content: "Write, publish and manage Ride N Care blog posts." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Blog Editor | Ride N Care Admin" },
      { property: "og:description", content: "Write, publish and manage Ride N Care blog posts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminBlog,
});

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  author: string;
  readMins: number;
  bodyText: string;
  published: boolean;
};

const emptyDraft: Draft = {
  slug: "",
  title: "",
  excerpt: "",
  category: POST_CATEGORIES[0],
  tags: "",
  author: "Ride N Care Team",
  readMins: 5,
  bodyText: "",
  published: false,
};

function toDraft(p: Post): Draft {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags.join(", "),
    author: p.author,
    readMins: p.readMins,
    bodyText: p.body.join("\n\n"),
    published: !!p.published,
  };
}

const input = "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";

function AdminBlog() {
  const qc = useQueryClient();
  const status = useServerFn(getAdminStatus);
  const list = useServerFn(adminListPosts);
  const save = useServerFn(adminSavePost);
  const remove = useServerFn(adminDeletePost);
  const claim = useServerFn(claimAdmin);

  const statusQ = useQuery({ queryKey: ["admin-status"], queryFn: () => status() });
  const isAdmin = statusQ.data?.isAdmin ?? false;

  const postsQ = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => list(),
    enabled: isAdmin,
  });

  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const claimM = useMutation({
    mutationFn: () => claim(),
    onSuccess: () => {
      toast.success("You're now an admin.");
      qc.invalidateQueries({ queryKey: ["admin-status"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveM = useMutation({
    mutationFn: () =>
      save({
        data: {
          slug: draft.slug || slugify(draft.title),
          title: draft.title,
          excerpt: draft.excerpt,
          category: draft.category,
          tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
          author: draft.author,
          readMins: Number(draft.readMins),
          body: draft.bodyText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
          published: draft.published,
        },
      }),
    onSuccess: () => {
      toast.success("Post saved.");
      setDraft(emptyDraft);
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteM = useMutation({
    mutationFn: (slug: string) => remove({ data: { slug } }),
    onSuccess: () => {
      toast.success("Post deleted.");
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (statusQ.isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-20 text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Admin access needed</h1>
        {statusQ.data?.canClaim ? (
          <>
            <p className="mt-3 text-muted-foreground">No admin exists yet. Claim admin access for this account.</p>
            <button
              onClick={() => claimM.mutate()}
              disabled={claimM.isPending}
              className="mt-6 rounded-full bg-grad-primary px-6 py-2.5 font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {claimM.isPending ? "Claiming…" : "Claim admin access"}
            </button>
          </>
        ) : (
          <p className="mt-3 text-muted-foreground">Ask an existing admin to grant your account access.</p>
        )}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/auth";
          }}
          className="mt-6 block w-full text-sm text-muted-foreground hover:text-primary"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Admin</span>
          <h1 className="mt-1 text-4xl font-bold">Blog editor</h1>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/auth";
          }}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          Sign out
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveM.mutate();
        }}
        className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-6 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <input
            id="title"
            aria-label="Title"
            required
            className={input}
            value={draft.title}
            onChange={(e) => {
              const v = e.target.value;
              setDraft((d) => ({ ...d, title: v, slug: d.slug || slugify(v) }));
            }}
          />
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium">Slug</label>
          <input id="slug" aria-label="Slug" required className={input} value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
        </div>
        <div>
          <label htmlFor="category" className="text-sm font-medium">Category</label>
          <select id="category" aria-label="Category" className={input} value={draft.category} onChange={(e) => set("category", e.target.value)}>
            {POST_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="excerpt" className="text-sm font-medium">Excerpt</label>
          <textarea id="excerpt" aria-label="Excerpt" rows={2} className={input} value={draft.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </div>
        <div>
          <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
          <input id="tags" aria-label="Tags" className={input} value={draft.tags} onChange={(e) => set("tags", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="author" className="text-sm font-medium">Author</label>
            <input id="author" aria-label="Author" className={input} value={draft.author} onChange={(e) => set("author", e.target.value)} />
          </div>
          <div>
            <label htmlFor="readMins" className="text-sm font-medium">Read mins</label>
            <input
              id="readMins"
              aria-label="Read minutes"
              type="number"
              min={1}
              max={60}
              className={input}
              value={draft.readMins}
              onChange={(e) => set("readMins", Number(e.target.value))}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="body" className="text-sm font-medium">Body (blank line between paragraphs)</label>
          <textarea id="body" aria-label="Body" rows={12} required className={`${input} font-mono`} value={draft.bodyText} onChange={(e) => set("bodyText", e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" aria-label="Published" checked={draft.published} onChange={(e) => set("published", e.target.checked)} />
          Published
        </label>
        <div className="flex gap-3 md:justify-end">
          <button type="button" onClick={() => setDraft(emptyDraft)} className="rounded-full border border-border px-5 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
            Clear
          </button>
          <button type="submit" disabled={saveM.isPending} className="rounded-full bg-grad-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
            {saveM.isPending ? "Saving…" : "Save post"}
          </button>
        </div>
      </form>

      <h2 className="mt-14 text-2xl font-bold">All posts</h2>
      <div className="mt-4 space-y-3">
        {postsQ.isLoading && <p className="text-muted-foreground">Loading posts…</p>}
        {postsQ.data?.posts.map((p) => (
          <div key={p.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-muted-foreground">{p.category}</span>
              </div>
              <p className="mt-1 font-semibold">{p.title}</p>
              <p className="text-xs text-muted-foreground">/blog/{p.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDraft(toDraft(p))} className="rounded-full border border-border px-4 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary">
                Edit
              </button>
              <button
                onClick={() => deleteM.mutate(p.slug)}
                disabled={deleteM.isPending}
                className="rounded-full border border-destructive/40 px-4 py-1.5 text-sm font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
