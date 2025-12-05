"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { withBasePath } from "@/lib/getBasePath";

/**
 * Componente de cabeçalho com logo centralizada
 */
export default function Header() {
  const [logoPath, setLogoPath] = useState<string>("/images/logo.png");

  useEffect(() => {
    setLogoPath(withBasePath("/images/logo.png"));
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200" role="banner">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <Link
          href="/"
          className="flex justify-center"
          aria-label="Ir para página inicial"
        >
          <div className="relative w-20 h-20">
            <Image
              src={logoPath}
              alt="Logo do site"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
