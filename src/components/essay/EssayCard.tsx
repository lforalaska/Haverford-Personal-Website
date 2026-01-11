import Link from 'next/link';
import type { Essay } from '@/types/essay';
import { EssayMeta } from './EssayMeta';

interface EssayCardProps {
  essay: Essay;
}

export function EssayCard({ essay }: EssayCardProps) {
  const { frontmatter, readingTime, slug } = essay;

  return (
    <article className="group relative flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg">
      <Link href={`/essays/${slug}`} className="after:absolute after:inset-0">
        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {frontmatter.title}
        </h2>
      </Link>

      <p className="text-gray-600 line-clamp-3">{frontmatter.excerpt}</p>

      <EssayMeta
        date={frontmatter.date}
        tags={frontmatter.tags}
        readingTime={readingTime}
      />
    </article>
  );
}
