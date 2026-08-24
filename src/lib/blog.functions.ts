import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { dbGetPost, dbListPosts } from "./blog.db";
import { rowToPost, type BlogRow, type Post } from "./blog";

const ADMIN_COLUMNS =
  "slug,title,excerpt,category,tags,author,read_mins,body,published,published_at,created_at";

const postSchema = z.object({
  slug: z.string().trim().min(3).max(80).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  title: z.string().trim().min(3).max(160),
  excerpt: z.string().trim().max(400).default(""),
  category: z.string().trim().min(2).max(60),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  author: z.string().trim().min(2).max(80).default("Ride N Care Team"),
  readMins: z.number().int().min(1).max(60).default(5),
  body: z.array(z.string().trim().min(1)).min(1).max(60),
  published: z.boolean().default(false),
});

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  return { posts: await dbListPosts({ limit: 200 }) };
});

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().trim().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const post = await dbGetPost(data.slug);
    const all = await dbListPosts({ limit: 20 });
    return { post, related: all.filter((p) => p.slug !== data.slug).slice(0, 2) };
  });

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: admin access required");
}

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (data) return { isAdmin: true, canClaim: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    return { isAdmin: false, canClaim: (count ?? 0) === 0 };
  });

// Bootstrap: the very first signed-in user may claim admin, only while no admin exists.
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("An admin already exists. Ask them to grant you access.");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select(ADMIN_COLUMNS)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { posts: ((data ?? []) as unknown as BlogRow[]).map(rowToPost) as Post[] };
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => postSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("blog_posts").upsert(
      {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        tags: data.tags,
        author: data.author,
        read_mins: data.readMins,
        body: data.body,
        published: data.published,
        published_at: data.published ? new Date().toISOString() : null,
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(error.message);
    return { ok: true, slug: data.slug };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ slug: z.string().trim().min(1) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("blog_posts").delete().eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
