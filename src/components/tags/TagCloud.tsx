import type { TagInfo } from '@/types/essay';
import { TagBadge } from './TagBadge';

interface TagCloudProps {
  tags: TagInfo[];
}

export function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No tags found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tagInfo) => (
        <TagBadge
          key={tagInfo.tag}
          tag={tagInfo.tag}
          count={tagInfo.count}
          size="lg"
        />
      ))}
    </div>
  );
}
