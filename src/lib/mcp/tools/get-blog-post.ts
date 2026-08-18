import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getPost } from "@/lib/blog";

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description: "Get the full text of a Ride N Care blog post by its slug (use search_blog_posts to find slugs).",
  inputSchema: { slug: z.string().trim().min(1).describe("Blog post slug, e.g. bike-service-checklist-bangalore.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const post = getPost(slug);
    if (!post) throw new ToolError(`No blog post found with slug "${slug}".`);
    const payload = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      date: post.date,
      category: post.category,
      tags: post.tags,
      readMins: post.readMins,
      body: post.body,
      url: `/blog/${post.slug}`,
    };
    return {
      content: [{ type: "text", text: `# ${post.title}\n\n${post.body.join("\n\n")}` }],
      structuredContent: payload,
    };
  },
});
