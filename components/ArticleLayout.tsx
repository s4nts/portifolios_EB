"use client";

import { useState, useEffect } from 'react';
import BackButton from './BackButton';
import LogoImage from './LogoImage';
import AuthModal from './AuthModal';
import { isAuthenticated } from '@/lib/auth';

interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  studentName: string;
  slug: string;
}

/**
 * Layout para páginas de artigos individuais com proteção por senha
 */
export default function ArticleLayout({
  children,
  title,
  studentName,
  slug,
}: ArticleLayoutProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verifica autenticação ao montar o componente
    const checkAuth = () => {
      const authenticated = isAuthenticated(slug);
      setIsAuthorized(authenticated);
      setIsAuthModalOpen(!authenticated);
    };

    checkAuth();
  }, [slug]);

  const handleAuthSuccess = () => {
    setIsAuthorized(true);
    setIsAuthModalOpen(false);
  };

  const safeTitle = title?.trim() || 'Artigo';
  const safeStudentName = studentName?.trim() || '';
  const displayTitle = safeStudentName 
    ? `${safeTitle} - ${safeStudentName}`
    : safeTitle;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative">
      <header className="w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <LogoImage />
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              {displayTitle}
            </h1>
          </div>
        </div>
      </header>

      <main className={`max-w-4xl mx-auto px-4 py-12 ${!isAuthorized ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {children}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        studentName={safeStudentName}
        slug={slug}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
