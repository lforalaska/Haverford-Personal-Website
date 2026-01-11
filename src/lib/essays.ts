import fs from 'fs';
import path from 'path';
import type { Essay, ProcessedEssay, TagInfo } from '@/types/essay';
import { parseFrontmatter, calculateReadingTime, processMarkdown } from './markdown';

const essaysDirectory = path.join(process.cwd(), 'content/essays');

/**
 * Get all published essays, sorted by date (newest first)
 * Filters out drafts in production
 */
export async function getAllEssays(): Promise<Essay[]> {
  // Check if essays directory exists
  if (!fs.existsSync(essaysDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(essaysDirectory);
  const essays: Essay[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md') || fileName.startsWith('_')) {
      continue;
    }

    const filePath = path.join(essaysDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, content } = parseFrontmatter(fileContent);

    // Skip drafts in production
    if (process.env.NODE_ENV === 'production' && frontmatter.draft) {
      continue;
    }

    const readingTime = calculateReadingTime(content);

    essays.push({
      frontmatter,
      content,
      slug: frontmatter.slug,
      readingTime,
    });
  }

  // Sort by date, newest first
  return essays.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}

/**
 * Get a single essay by slug with processed HTML content
 */
export async function getEssayBySlug(slug: string): Promise<ProcessedEssay | null> {
  const essays = await getAllEssays();
  const essay = essays.find((e) => e.slug === slug);

  if (!essay) {
    return null;
  }

  const htmlContent = await processMarkdown(essay.content);

  return {
    ...essay,
    htmlContent,
  };
}

/**
 * Get all essays filtered by a specific tag
 */
export async function getEssaysByTag(tag: string): Promise<Essay[]> {
  const allEssays = await getAllEssays();
  return allEssays.filter((essay) =>
    essay.frontmatter.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/**
 * Get all unique tags with their counts
 * Returns tags sorted by count (descending)
 */
export async function getAllTags(): Promise<TagInfo[]> {
  const essays = await getAllEssays();
  const tagCounts = new Map<string, number>();

  essays.forEach((essay) => {
    essay.frontmatter.tags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      tagCounts.set(lowerTag, (tagCounts.get(lowerTag) || 0) + 1);
    });
  });

  const tags: TagInfo[] = Array.from(tagCounts.entries()).map(([tag, count]) => ({
    tag,
    count,
  }));

  return tags.sort((a, b) => b.count - a.count);
}

/**
 * Get all essay slugs for static generation
 */
export async function getAllEssaySlugs(): Promise<string[]> {
  const essays = await getAllEssays();
  return essays.map((essay) => essay.slug);
}

/**
 * Get all tag slugs for static generation
 */
export async function getAllTagSlugs(): Promise<string[]> {
  const tags = await getAllTags();
  return tags.map((tag) => tag.tag);
}
