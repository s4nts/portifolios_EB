"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { withBasePath } from "@/lib/getBasePath";

/**
 * Componente de cabeçalho com logo e título
 */
export default function Header() {
  const [logoPath, setLogoPath] = useState<string>("/images/logo.png");

  useEffect(() => {
    setLogoPath(withBasePath("/images/logo.png"));
  }, []);

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm" role="banner">
      <div className="max-w-5xl mx-auto py-6 px-4">
        <Link
          href="/"
          className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label="Ir para página inicial"
        >
          <div className="relative w-16 h-16">
            <Image
              src={logoPath}
              alt="Logo do site"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Portifólios Educacionais
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Maternal II - 2025
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
