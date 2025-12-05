"use client";

import Image from "next/image";
import { useMemo } from "react";

interface ArticleSectionProps {
  heading: string;
  body: string;
  image: string;
}

/**
 * Componente que exibe uma seção de artigo com título, corpo e imagem
 */
export default function ArticleSection({
  heading,
  body,
  image,
}: ArticleSectionProps) {
  // Validação básica das props
  const safeHeading = useMemo(() => heading?.trim() || "", [heading]);
  const safeBody = useMemo(() => body?.trim() || "", [body]);
  const safeImage = useMemo(() => {
    if (!image || typeof image !== "string") {
      return "/images/logo.png"; // Fallback para imagem padrão
    }
    return image;
  }, [image]);

  if (!safeHeading && !safeBody) {
    return null;
  }

  return (
    <section
      className="mb-12"
      aria-labelledby={`section-${safeHeading.slice(0, 10)}`}
    >
      {safeHeading && (
        <h2
          id={`section-${safeHeading.slice(0, 10)}`}
          className="text-2xl font-semibold text-gray-900 mb-4"
        >
          {safeHeading}
        </h2>
      )}
      {safeBody && (
        <p className="text-base text-gray-700 leading-relaxed mb-6">
          {safeBody}
        </p>
      )}
      <div className="flex justify-center">
        <div className="relative w-full md:w-[320px] h-[200px] md:h-[200px]">
          <Image
            src={safeImage}
            alt={safeHeading || "Imagem da seção"}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 320px"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
