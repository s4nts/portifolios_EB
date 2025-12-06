"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { getBasePath } from "@/lib/getBasePath";

interface ShareButtonProps {
  isAuthModalOpen?: boolean;
}

/**
 * Botão flutuante para compartilhar o link da página com bypass de senha
 */
export default function ShareButton({
  isAuthModalOpen = false,
}: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const pathname = usePathname();

  const handleShare = async () => {
    try {
      // Obtém o basePath atual
      const basePath = getBasePath();

      // Constrói a URL completa: origin + basePath + pathname
      const fullPath = basePath ? `${basePath}${pathname}` : pathname;
      const currentUrl = `${window.location.origin}${fullPath}`;

      // Gera um token simples baseado no pathname e data atual (válido por 24h)
      const token = btoa(
        `${pathname}-${Math.floor(Date.now() / (1000 * 60 * 60 * 24))}`
      ).replace(/[+/=]/g, "");

      // Monta a URL completa com o token de compartilhamento
      const shareUrl = `${currentUrl}?share=${token}`;

      // Copia para a área de transferência
      await navigator.clipboard.writeText(shareUrl);

      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      // Fallback para navegadores mais antigos
      const basePath = getBasePath();
      const fullPath = basePath ? `${basePath}${pathname}` : pathname;
      const currentUrl = `${window.location.origin}${fullPath}`;
      const token = btoa(
        `${pathname}-${Math.floor(Date.now() / (1000 * 60 * 60 * 24))}`
      ).replace(/[+/=]/g, "");
      const textArea = document.createElement("textarea");
      textArea.value = `${currentUrl}?share=${token}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  // Não exibe se o modal de autenticação estiver aberto
  if (isAuthModalOpen) {
    return null;
  }

  return (
    <button
      onClick={handleShare}
      className="fixed right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 md:top-6 md:bottom-auto shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      aria-label="Compartilhar link"
      type="button"
      title="Copiar link para compartilhar"
      style={{
        top: "auto",
        bottom: "calc(6rem + 0.5rem)", // Posiciona acima do botão de voltar ao topo no mobile com espaço reduzido
      }}
    >
      {isCopied ? (
        <Check className="w-6 h-6" />
      ) : (
        <Share2 className="w-6 h-6" />
      )}
    </button>
  );
}
