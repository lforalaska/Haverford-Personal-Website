import type { Metadata } from 'next';
import { getAllTagSlugs, getEssaysByTag } from '@/lib/essays';
import { Container } from '@/components/ui/Container';
import { EssayList } from '@/components/essay/EssayList';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = await getAllTagSlugs();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Essays tagged with "${tag}"`,
    description: `Browse all essays tagged with ${tag}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const essays = await getEssaysByTag(tag);

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          <span className="text-gray-500">Tagged with</span> {tag}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {essays.length} {essays.length === 1 ? 'essay' : 'essays'} found
        </p>
      </div>

      <EssayList essays={essays} />
    </Container>
  );
}
