import Header from '@/components/Header';
import ArticleListItem from '@/components/ArticleListItem';
import { getAllArticles } from '@/lib/contentLoader';

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleListItem
              key={article.slug}
              title={article.title}
              slug={article.slug}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
