"use client";

import { useMemo } from "react";
import ArticleSection from "./ArticleSection";

interface Section {
  heading: string;
  body: string;
  image: string | string[];
}

interface ArticleContentProps {
  sections: Section[];
  slug: string;
}

/**
 * Verifica se uma imagem é válida (não é genérica/modelo)
 */
function isValidImage(image: string | string[]): boolean {
  if (!image) return false;
  
  const images = Array.isArray(image) ? image : [image];
  
  return images.some((img) => {
    if (!img || typeof img !== 'string') return false;
    // Remove imagens genéricas (modelo1-sec*.jpg)
    if (img.includes('/images/modelo')) return false;
    // Remove imagens vazias ou inválidas
    if (img.trim() === '' || img === '/images/logo.png') return false;
    return true;
  });
}

export default function ArticleContent({
  sections,
  slug,
}: ArticleContentProps) {
  // Filtra seções que têm imagens válidas
  const validSections = useMemo(() => {
    return sections.filter((section) => isValidImage(section.image));
  }, [sections]);

  return (
    <div className="w-full">
      <div>
        {validSections.map((section, index) => (
          <div key={`${slug}-section-${index}`}>
            <ArticleSection
              heading={section.heading}
              body={section.body}
              image={section.image}
              isLast={index === validSections.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
