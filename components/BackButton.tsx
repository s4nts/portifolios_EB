"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Componente de botão para voltar à página inicial
 */
export default function BackButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded px-2 py-1"
      aria-label="Voltar para página inicial"
      type="button"
    >
      <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      <span className="text-sm font-medium">Voltar</span>
    </button>
  );
}
