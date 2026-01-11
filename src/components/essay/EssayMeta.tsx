import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface EssayMetaProps {
  date: string;
  tags: string[];
  readingTime: number;
  showTags?: boolean;
}

export function EssayMeta({ date, tags, readingTime, showTags = true }: EssayMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
      <time dateTime={date}>{formatDate(date)}</time>
      <span>•</span>
      <span>{readingTime} min read</span>

      {showTags && tags.length > 0 && (
        <>
          <span>•</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag.toLowerCase()}`}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
