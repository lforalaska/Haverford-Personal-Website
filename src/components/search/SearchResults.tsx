import Link from 'next/link';
import type { SearchResult } from '@/lib/search';
import { formatDate } from '@/lib/utils';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
}

export function SearchResults({ results, query, isLoading = false }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Searching...</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Enter a search query to find essays</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No essays found for "{query}"</p>
        <p className="mt-2 text-sm text-gray-400">Try different keywords or browse by tags</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Found {results.length} {results.length === 1 ? 'essay' : 'essays'}
      </p>

      <div className="space-y-6">
        {results.map((result) => (
          <article
            key={result.id}
            className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg"
          >
            <Link href={`/essays/${result.slug}`}>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {result.title}
              </h2>
            </Link>

            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <time dateTime={result.date}>{formatDate(result.date)}</time>
              {result.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${tag.toLowerCase()}`}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <p className="text-gray-600">{result.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
