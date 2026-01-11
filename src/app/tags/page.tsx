import { getAllTags } from '@/lib/essays';
import { Container } from '@/components/ui/Container';
import { TagCloud } from '@/components/tags/TagCloud';

export const metadata = {
  title: 'Tags',
  description: 'Browse essays by topic',
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Browse by Tag
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore essays organized by topic
        </p>
      </div>

      <TagCloud tags={tags} />
    </Container>
  );
}
