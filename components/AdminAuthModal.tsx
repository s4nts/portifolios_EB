"use client";

import { useState, useEffect, FormEvent } from "react";
import { Lock } from "lucide-react";
import { isAdminPassword, setAdminAuthenticated } from "@/lib/auth";

interface AdminAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

/**
 * Modal de autenticação para a página inicial (apenas senha admin)
 */
export default function AdminAuthModal({
  isOpen,
  onSuccess,
}: AdminAuthModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    if (isAdminPassword(password)) {
      setAdminAuthenticated();
      setPassword("");
      onSuccess();
    } else {
      setError(
        "Senha incorreta. Apenas a senha de administrador é aceita aqui."
      );
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
          {/* Ícone de cadeado */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
            Acesso Administrativo
          </h2>

          <p className="text-sm text-slate-600 text-center mb-6">
            Esta área é restrita. Por favor, insira a senha de administrador
            para acessar a listagem de portfólios.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Senha de Administrador
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Digite a senha de administrador"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                disabled={isLoading}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verificando..." : "Acessar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
