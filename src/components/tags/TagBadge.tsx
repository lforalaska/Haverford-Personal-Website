import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function TagBadge({ tag, count, size = 'md' }: TagBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <Link
      href={`/tags/${tag.toLowerCase()}`}
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-gray-100 font-medium text-gray-700 hover:bg-gray-200 transition-colors',
        sizeClasses[size]
      )}
    >
      <span>{tag}</span>
      {count !== undefined && (
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs">
          {count}
        </span>
      )}
    </Link>
  );
}
