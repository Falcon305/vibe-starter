import { marked } from "marked";

export async function renderMarkdown(markdown: string): Promise<string> {
  return marked.parse(markdown);
}
