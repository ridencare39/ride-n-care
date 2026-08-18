import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { posts } from "@/lib/blog";

export default defineTool({
  name: "search_blog_posts",
  title: "Search blog posts",
  description: "Search Ride N Care's bike and car care blog. Returns matching post summaries and slugs.",
  inputSchema: {
    query: z.string().trim().optional().describe("Keywords to match against title, excerpt and tags."),
    category: z.string().trim().optional().describe("Category filter, e.g. Bike Care, Car Care, Doorstep Tips, Bangalore Guides."),
    limit: z.number().int().min(1).max(50).default(10).describe("Maximum number of posts to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, limit }) => {
    const q = query?.toLowerCase();
    const cat = category?.toLowerCase();
    const results = posts
      .filter((p) => {
        if (cat && cat !== "all" && p.category.toLowerCase() !== cat) return false;
        if (!q) return true;
        const haystack = `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.category}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, limit)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        tags: p.tags,
        date: p.date,
        readMins: p.readMins,
        url: `/blog/${p.slug}`,
      }));
    const payload = { count: results.length, posts: results };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
