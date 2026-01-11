import { getAllEssays } from '@/lib/essays';
import { Container } from '@/components/ui/Container';
import { EssayList } from '@/components/essay/EssayList';

export default async function HomePage() {
  const essays = await getAllEssays();

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Essays
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Thoughts and reflections on life, ideas, and experiences. Published weekly.
        </p>
      </div>

      <EssayList essays={essays} />
    </Container>
  );
}
