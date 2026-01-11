import FlexSearch from 'flexsearch';

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  slug: string;
  date: string;
}

interface SearchIndexItem extends SearchResult {
  content: string;
}

let searchIndex: FlexSearch.Index | null = null;
let searchData: SearchIndexItem[] = [];

export async function initializeSearch() {
  if (searchIndex) {
    return; // Already initialized
  }

  try {
    const response = await fetch('/search-index.json');
    searchData = await response.json();

    searchIndex = new FlexSearch.Index({
      tokenize: 'forward',
      charset: 'latin:extra',
      resolution: 9,
      depth: 3,
      bidirectional: true,
    });

    // Index all documents
    searchData.forEach((item, index) => {
      const searchableText = [
        item.title,
        item.excerpt,
        item.content,
        ...item.tags,
      ].join(' ');

      searchIndex!.add(index, searchableText);
    });
  } catch (error) {
    console.error('Failed to initialize search:', error);
    throw error;
  }
}

export async function search(query: string): Promise<SearchResult[]> {
  if (!searchIndex) {
    await initializeSearch();
  }

  if (!query.trim()) {
    return [];
  }

  try {
    const results = await searchIndex!.search(query, { limit: 20 });

    return results.map((index) => {
      const item = searchData[index as number];
      return {
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        tags: item.tags,
        slug: item.slug,
        date: item.date,
      };
    });
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
