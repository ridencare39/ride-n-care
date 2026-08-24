export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readMins: number;
  category: string;
  tags: string[];
  body: string[];
  published?: boolean;
}

export const CATEGORIES = ["All", "Bike Care", "Car Care", "Doorstep Tips", "Bangalore Guides"] as const;
export type Category = typeof CATEGORIES[number];

export const POST_CATEGORIES = ["Bike Care", "Car Care", "Doorstep Tips", "Bangalore Guides"] as const;

export interface BlogRow {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[] | null;
  author: string;
  read_mins: number;
  body: string[] | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export function rowToPost(row: BlogRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    date: (row.published_at ?? row.created_at).slice(0, 10),
    author: row.author,
    readMins: row.read_mins,
    category: row.category,
    tags: row.tags ?? [],
    body: row.body ?? [],
    published: row.published,
  };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
