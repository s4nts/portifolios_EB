import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/ArticleLayout';
import ArticleSection from '@/components/ArticleSection';
import { getArticleBySlug, getAllSlugs } from '@/lib/contentLoader';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Gera metadados para a página do artigo
 */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Artigo não encontrado',
      description: 'O artigo solicitado não foi encontrado.',
    };
  }

  const description =
    article.sections[0]?.body.substring(0, 160).trim() || article.title;

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
    },
  };
}

/**
 * Gera os parâmetros estáticos para todas as páginas de artigos
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * Página de exibição de um artigo individual
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <ArticleLayout 
      title={article.title}
      studentName={article.studentName}
      slug={article.slug}
    >
      {article.sections.map((section, index) => (
        <ArticleSection
          key={`${article.slug}-section-${index}`}
          heading={section.heading}
          body={section.body}
          image={section.image}
        />
      ))}
    </ArticleLayout>
  );
}
