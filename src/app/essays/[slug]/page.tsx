import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllEssaySlugs, getEssayBySlug } from '@/lib/essays';
import { Container } from '@/components/ui/Container';
import { EssayContent } from '@/components/essay/EssayContent';
import { EssayMeta } from '@/components/essay/EssayMeta';

interface EssayPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllEssaySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getEssayBySlug(slug);

  if (!essay) {
    return {
      title: 'Essay Not Found',
    };
  }

  return {
    title: essay.frontmatter.title,
    description: essay.frontmatter.excerpt,
    keywords: essay.frontmatter.tags,
    openGraph: {
      title: essay.frontmatter.title,
      description: essay.frontmatter.excerpt,
      type: 'article',
      publishedTime: essay.frontmatter.date,
      tags: essay.frontmatter.tags,
    },
  };
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const essay = await getEssayBySlug(slug);

  if (!essay) {
    notFound();
  }

  return (
    <Container className="py-12">
      <article className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            {essay.frontmatter.title}
          </h1>
          <EssayMeta
            date={essay.frontmatter.date}
            tags={essay.frontmatter.tags}
            readingTime={essay.readingTime}
          />
        </header>

        <EssayContent htmlContent={essay.htmlContent} />
      </article>
    </Container>
  );
}
