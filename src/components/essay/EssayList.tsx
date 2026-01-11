import type { Essay } from '@/types/essay';
import { EssayCard } from './EssayCard';

interface EssayListProps {
  essays: Essay[];
}

export function EssayList({ essays }: EssayListProps) {
  if (essays.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No essays found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {essays.map((essay) => (
        <EssayCard key={essay.slug} essay={essay} />
      ))}
    </div>
  );
}
