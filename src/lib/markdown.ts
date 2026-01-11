import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import type { EssayFrontmatter } from '@/types/essay';

/**
 * Parse markdown file content and extract frontmatter
 */
export function parseFrontmatter(fileContent: string) {
  const { data, content } = matter(fileContent);
  return {
    frontmatter: data as EssayFrontmatter,
    content,
  };
}

/**
 * Calculate reading time in minutes
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Process markdown content to HTML with syntax highlighting and other enhancements
 */
export async function processMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse) // Parse markdown to MDAST
    .use(remarkGfm) // Support GitHub Flavored Markdown (tables, strikethrough, etc.)
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert MDAST to HAST
    .use(rehypeRaw) // Parse raw HTML in markdown
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['heading-link'],
      },
    }) // Add links to headings
    .use(rehypePrettyCode, {
      theme: 'github-dark',
      keepBackground: true,
      onVisitLine(node: any) {
        // Prevent lines from collapsing in empty lines
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }];
        }
      },
      onVisitHighlightedLine(node: any) {
        node.properties.className = ['line--highlighted'];
      },
      onVisitHighlightedChars(node: any) {
        node.properties.className = ['word--highlighted'];
      },
    }) // Syntax highlighting with Shiki
    .use(rehypeStringify) // Serialize HAST to HTML
    .process(content);

  return String(result);
}

/**
 * Extract table of contents from markdown content
 * Returns an array of headings with their levels, text, and slugs
 */
export function extractTableOfContents(content: string) {
  const headingRegex = /^#{1,3}\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; slug: string }> = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[0].indexOf(' ');
    const text = match[1];
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    headings.push({ level, text, slug });
  }

  return headings;
}
