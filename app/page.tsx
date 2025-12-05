import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleListItem from '@/components/ArticleListItem';
import { getAllArticles } from '@/lib/contentLoader';

/**
 * Página inicial que lista todos os artigos disponíveis
 */
export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12 flex-1">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Nenhum portifólio disponível no momento.</p>
          </div>
        ) : (
          <div className="space-y-5" role="list">
            {articles.map((article) => (
              <ArticleListItem
                key={article.slug}
                title={article.title}
                slug={article.slug}
                studentName={article.studentName}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
