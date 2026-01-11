import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { EssayData, UploadRequest } from '@/types/upload';

const ESSAYS_DIR = path.join(process.cwd(), 'content/essays');

// Slug validation regex: lowercase letters, numbers, hyphens
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateEssayData(data: UploadRequest): {
  valid: boolean;
  error?: string;
} {
  if (!data.file) {
    return { valid: false, error: 'File is required' };
  }

  if (!data.file.name.endsWith('.md')) {
    return { valid: false, error: 'File must be a markdown (.md) file' };
  }

  if (!data.title?.trim()) {
    return { valid: false, error: 'Title is required' };
  }

  if (!data.date) {
    return { valid: false, error: 'Date is required' };
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.date)) {
    return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
  }

  if (!data.slug?.trim()) {
    return { valid: false, error: 'Slug is required' };
  }

  // Validate slug format
  if (!SLUG_REGEX.test(data.slug)) {
    return {
      valid: false,
      error: 'Slug must contain only lowercase letters, numbers, and hyphens',
    };
  }

  // Validate tags
  try {
    const tags = JSON.parse(data.tags);
    if (!Array.isArray(tags) || tags.length === 0) {
      return { valid: false, error: 'At least one tag is required' };
    }
  } catch {
    return { valid: false, error: 'Invalid tags format' };
  }

  if (!data.excerpt?.trim()) {
    return { valid: false, error: 'Excerpt is required' };
  }

  if (data.excerpt.length < 50 || data.excerpt.length > 300) {
    return {
      valid: false,
      error: 'Excerpt must be between 50 and 300 characters',
    };
  }

  return { valid: true };
}

export async function saveEssay(data: EssayData): Promise<{
  success: boolean;
  error?: string;
  slug?: string;
}> {
  try {
    // Sanitize slug to prevent path traversal
    const sanitizedSlug = data.slug.replace(/[^a-z0-9-]/g, '');
    const fileName = `${sanitizedSlug}.md`;
    const filePath = path.join(ESSAYS_DIR, fileName);

    // Check if file already exists
    try {
      await fs.access(filePath);
      return {
        success: false,
        error: `Essay with slug "${sanitizedSlug}" already exists`,
      };
    } catch {
      // File doesn't exist, which is what we want
    }

    // Extract content if the uploaded file already has frontmatter
    let essayContent = data.content;
    const parsed = matter(data.content);

    // If content has frontmatter, use the content without frontmatter
    if (parsed.content.trim()) {
      essayContent = parsed.content;
    }

    // Construct frontmatter
    const frontmatter = {
      title: data.title,
      date: data.date,
      slug: sanitizedSlug,
      tags: data.tags,
      excerpt: data.excerpt,
      draft: data.draft,
    };

    // Create the complete markdown file with frontmatter
    const fileContent = matter.stringify(essayContent, frontmatter);

    // Ensure essays directory exists
    await fs.mkdir(ESSAYS_DIR, { recursive: true });

    // Write file
    await fs.writeFile(filePath, fileContent, 'utf-8');

    return {
      success: true,
      slug: sanitizedSlug,
    };
  } catch (error) {
    console.error('Error saving essay:', error);
    return {
      success: false,
      error: 'Failed to save essay to disk',
    };
  }
}

export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
