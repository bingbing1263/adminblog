import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export function parseMarkdown(markdown: string) {
  return matter(markdown);
}

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
} 