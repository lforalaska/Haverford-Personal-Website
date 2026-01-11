import fs from 'fs/promises';
import path from 'path';
import { getAllEssays } from './essays';

interface SearchIndexItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  slug: string;
  date: string;
}

export async function regenerateSearchIndex(): Promise<void> {
  console.log('Regenerating search index...');

  const essays = await getAllEssays();
  const searchIndex: SearchIndexItem[] = essays.map((essay) => ({
    id: essay.slug,
    title: essay.frontmatter.title,
    excerpt: essay.frontmatter.excerpt,
    content: essay.content.substring(0, 1000), // First 1000 chars
    tags: essay.frontmatter.tags,
    slug: essay.slug,
    date: essay.frontmatter.date,
  }));

  const outputPath = path.join(process.cwd(), 'public', 'search-index.json');

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  await fs.mkdir(publicDir, { recursive: true });

  await fs.writeFile(outputPath, JSON.stringify(searchIndex, null, 2));

  console.log(`Search index regenerated: ${searchIndex.length} essays indexed`);
}
