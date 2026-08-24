// Server-side blog data access. All env reads happen inside functions so this
// module is safe to import from route/MCP modules.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { rowToPost, type BlogRow, type Post } from "./blog";

const COLUMNS =
  "slug,title,excerpt,category,tags,author,read_mins,body,published,published_at,created_at";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export async function dbListPosts(opts: { category?: string; query?: string; limit?: number } = {}): Promise<Post[]> {
  const supabase = publicClient();
  let q = supabase
    .from("blog_posts")
    .select(COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(opts.limit ?? 100);

  if (opts.category && opts.category.toLowerCase() !== "all") {
    q = q.eq("category", opts.category);
  }

  const { data, error } = await q;
  if (error) {
    console.error("[blog] list failed:", error.message);
    return [];
  }
  let posts = ((data ?? []) as unknown as BlogRow[]).map(rowToPost);
  const term = opts.query?.trim().toLowerCase();
  if (term) {
    posts = posts.filter((p) =>
      `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.category}`.toLowerCase().includes(term),
    );
  }
  return posts;
}

export async function dbGetPost(slug: string): Promise<Post | null> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("[blog] get failed:", error.message);
    return null;
  }
  return data ? rowToPost(data as unknown as BlogRow) : null;
}
