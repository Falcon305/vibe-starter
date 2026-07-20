import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rendererPath = path.resolve("lib/blog/render.ts");
const rendererSpecifier = "@/lib/blog/render";

type RendererModule = { renderMarkdown: (markdown: string) => Promise<string> };

function importRenderer(): Promise<RendererModule> {
  return import(rendererSpecifier) as Promise<RendererModule>;
}

describe.skipIf(!fs.existsSync(rendererPath))("blog markdown sanitization", () => {
  it("strips script tags, event handlers, and javascript URLs", async () => {
    const { renderMarkdown } = await importRenderer();
    const payload = [
      "# Hello",
      "",
      "<script>alert('xss')</script>",
      "",
      '<img src=x onerror="alert(1)">',
      "",
      "[link](javascript:alert('xss'))",
    ].join("\n");

    const html = await renderMarkdown(payload);

    expect(html).toContain("<h1>Hello</h1>");
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/onerror/i);
    expect(html).not.toMatch(/javascript:/i);
  });

  it("keeps ordinary markdown intact", async () => {
    const { renderMarkdown } = await importRenderer();
    const html = await renderMarkdown("**bold** and [a link](https://example.com)");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain('href="https://example.com"');
  });
});
