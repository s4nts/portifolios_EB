"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, X } from "lucide-react";
import { isValidPassword, setAuthenticated } from "@/lib/auth";

interface AuthModalProps {
  isOpen: boolean;
  studentName: string;
  slug: string;
  onSuccess: () => void;
}

/**
 * Modal de autenticação para proteger os artigos
 */
export default function AuthModal({
  isOpen,
  studentName,
  slug,
  onSuccess,
}: AuthModalProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    router.push("/");
  };

  useEffect(() => {
    if (isOpen) {
      // Reset ao abrir
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simula um pequeno delay para melhor UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (isValidPassword(password, studentName)) {
      setAuthenticated(slug);
      setPassword("");
      onSuccess();
    } else {
      setError("Senha incorreta. Tente novamente.");
    }

    setIsLoading(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop com blur */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
          {/* Botão X para fechar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
            aria-label="Fechar e voltar à listagem"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ícone de cadeado */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
            Acesso Protegido
          </h2>
          
          <p className="text-sm text-slate-600 text-center mb-6">
            Por questões de segurança e privacidade, este portifólio está protegido. 
            Por favor, insira a senha para visualizar o conteúdo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Digite a senha"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verificando..." : "Desbloquear"}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-500 text-center">
            Portifólio de {studentName}
          </p>
        </div>
      </div>
    </>
  );
}

