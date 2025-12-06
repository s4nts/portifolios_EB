"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  isAuthModalOpen?: boolean;
}

/**
 * Botão flutuante para rolar a página para o topo
 */
export default function ScrollToTopButton({
  isAuthModalOpen = false,
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostra o botão quando o usuário rolar mais de 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Não exibe se o modal de autenticação estiver aberto ou se não estiver visível
  if (!isVisible || isAuthModalOpen) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Voltar ao topo"
      type="button"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
