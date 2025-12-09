"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { Download } from "lucide-react";
import { withBasePath } from "@/lib/getBasePath";

interface ArticleSectionProps {
  heading: string;
  body: string;
  image: string | string[];
  isLast?: boolean;
}

/**
 * Componente que exibe uma seção de artigo com título, corpo e imagem(s)
 */
export default function ArticleSection({
  heading,
  body,
  image,
  isLast = false,
}: ArticleSectionProps) {
  // Normaliza para array
  const images = useMemo(() => {
    return Array.isArray(image) ? image : [image];
  }, [image]);

  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [logoPath, setLogoPath] = useState<string>("/images/logo.png");

  // Validação básica das props
  const safeHeading = useMemo(() => heading?.trim() || "", [heading]);
  const safeBody = useMemo(() => body?.trim() || "", [body]);

  useEffect(() => {
    // Aplica basePath após montagem do componente (no cliente)
    const paths = images.map((img) => {
      const baseImage = img?.trim() || "/images/logo.png";
      return withBasePath(baseImage);
    });
    setImagePaths(paths);
    setLogoPath(withBasePath("/images/logo.png"));
  }, [images]);

  const handleDownload = async (imagePath: string, alt: string) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${alt || "imagem"}.${blob.type.split("/")[1] || "jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer download da imagem:", error);
    }
  };

  if (!safeHeading && !safeBody) {
    return null;
  }

  return (
    <>
      <section
        className="mb-12 relative"
        aria-labelledby={`section-${safeHeading.slice(0, 10)}`}
      >
        {/* Marca d'água - Logo e nome da escola com transparência */}
        <div className="flex flex-col items-center justify-center mb-6 opacity-30">
          <div className="relative w-20 h-20 mb-2">
            <Image
              src={logoPath}
              alt="Logo da escola"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-xs md:text-sm font-semibold text-slate-600 uppercase text-center">
            Centro de Educação Infantil Hercílio Bento
          </p>
        </div>

        {/* 1. Título */}
        {safeHeading && (
          <h2
            id={`section-${safeHeading.slice(0, 10)}`}
            className="text-2xl font-semibold text-slate-800 mb-6 text-center"
          >
            {safeHeading}
          </h2>
        )}

        {/* 2. Galeria de imagens */}
        {imagePaths.length > 0 && (
          <div
            className={`flex ${
              imagePaths.length > 1 ? "flex-row flex-wrap" : "justify-center"
            } gap-6 mb-6`}
          >
            {imagePaths.map((imagePath, index) => (
              <div
                key={index}
                className={`relative group w-full ${
                  imagePaths.length > 1
                    ? "md:flex-1 md:min-w-[300px]"
                    : "md:w-auto"
                }`}
              >
                <div
                  className={`relative w-full ${
                    imagePaths.length > 1
                      ? "h-[450px]"
                      : "md:w-[600px] h-[450px]"
                  } overflow-hidden`}
                >
                  <Image
                    src={imagePath}
                    alt={`${safeHeading || "Imagem da seção"} - ${index + 1}`}
                    fill
                    className="object-contain bg-slate-50"
                    sizes={
                      imagePaths.length > 1
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, 600px"
                    }
                    loading="lazy"
                  />

                  {/* Botão de download */}
                  <button
                    onClick={() =>
                      handleDownload(imagePath, `${safeHeading}-${index + 1}`)
                    }
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Baixar imagem ${index + 1}`}
                    type="button"
                  >
                    <Download className="w-5 h-5 text-slate-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Objetivo */}
        {safeBody && (
          <p className="text-base text-slate-700 leading-relaxed text-justify">
            {safeBody.startsWith("OBJETIVO:") ? (
              <>
                <span className="font-bold">OBJETIVO:</span>
                {safeBody.substring(9)}
              </>
            ) : (
              safeBody
            )}
          </p>
        )}
      </section>

      {/* Separador entre seções (não exibe na última) */}
      {!isLast && <div className="border-t border-slate-200 my-8"></div>}
    </>
  );
}
