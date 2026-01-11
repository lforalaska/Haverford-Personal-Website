import fs from 'fs';
import path from 'path';
import { getAllEssays } from '../src/lib/essays';

interface SearchIndexItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  slug: string;
  date: string;
}

async function generateSearchIndex() {
  console.log('Generating search index...');

  const essays = await getAllEssays();
  const searchIndex: SearchIndexItem[] = essays.map((essay) => ({
    id: essay.slug,
    title: essay.frontmatter.title,
    excerpt: essay.frontmatter.excerpt,
    content: essay.content.substring(0, 1000), // First 1000 chars for search
    tags: essay.frontmatter.tags,
    slug: essay.slug,
    date: essay.frontmatter.date,
  }));

  const outputPath = path.join(process.cwd(), 'public', 'search-index.json');

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
  console.log(`✓ Search index generated: ${searchIndex.length} essays indexed`);
}

generateSearchIndex().catch((error) => {
  console.error('Error generating search index:', error);
  process.exit(1);
});
