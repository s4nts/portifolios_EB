import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/ArticleLayout';
import ArticleSection from '@/components/ArticleSection';
import { getArticleBySlug, getAllSlugs } from '@/lib/contentLoader';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Artigo não encontrado',
    };
  }

  return {
    title: article.title,
    description: article.sections[0]?.body.substring(0, 160) || article.title,
  };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <ArticleLayout title={article.title}>
      {article.sections.map((section, index) => (
        <ArticleSection
          key={index}
          heading={section.heading}
          body={section.body}
          image={section.image}
        />
      ))}
    </ArticleLayout>
  );
}
