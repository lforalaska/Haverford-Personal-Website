'use client';

import { useState, useCallback, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { search as performSearch, type SearchResult } from '@/lib/search';

export default function SearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await performSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
          Search Essays
        </h1>
        <p className="text-lg text-gray-600">
          Find essays by title, content, or tags
        </p>
      </div>

      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <SearchResults results={results} query={query} isLoading={isLoading} />
    </Container>
  );
}
