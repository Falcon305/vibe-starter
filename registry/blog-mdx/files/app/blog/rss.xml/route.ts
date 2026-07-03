import { getAllPosts } from "@/lib/blog/posts";
import { site } from "@/lib/site";

const escapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => escapes[character] ?? character);
}

export function GET() {
  const posts = getAllPosts();
  const items = posts
    .map(
      (post) => `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${site.url}/blog/${post.slug}</link>
      <description>${escapeXml(post.description)}</description>
    </item>`,
    )
    .join("\n    ");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}/blog</link>
    <description>${escapeXml(site.description)}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
