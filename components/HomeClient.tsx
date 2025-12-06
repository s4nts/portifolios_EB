"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleListItem from "@/components/ArticleListItem";
import AdminAuthModal from "@/components/AdminAuthModal";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Article } from "@/lib/contentLoader";

interface HomeClientProps {
  articles: Article[];
}

/**
 * Componente cliente que gerencia a autenticação e exibe a listagem
 */
export default function HomeClient({ articles }: HomeClientProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Verifica autenticação ao montar o componente
    const checkAuth = () => {
      const authenticated = isAdminAuthenticated();
      setIsAuthorized(authenticated);
      setIsAuthModalOpen(!authenticated);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthorized(true);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />
      <main
        className={`max-w-5xl mx-auto px-4 py-12 flex-1 ${
          !isAuthorized ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">
              Nenhum portifólio disponível no momento.
            </p>
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

      <AdminAuthModal isOpen={isAuthModalOpen} onSuccess={handleAuthSuccess} />

      <ScrollToTopButton isAuthModalOpen={isAuthModalOpen} />
    </div>
  );
}
