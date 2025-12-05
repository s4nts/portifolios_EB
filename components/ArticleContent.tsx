"use client";

import { useState, useEffect, useRef } from "react";
import ArticleSection from "./ArticleSection";
import Timeline from "./Timeline";
import { getPeriodForSection } from "@/lib/periodMapper";

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
 * Componente que gerencia a exibição das seções e timeline
 */
export default function ArticleContent({
  sections,
  slug,
}: ArticleContentProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState<
    number | undefined
  >(undefined);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1) {
            setActiveSectionIndex(index);
          }
        }
      });
    }, observerOptions);

    // Observa todos os refs disponíveis
    const currentRefs = sectionRefs.current.filter(Boolean);
    currentRefs.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [sections.length]);

  return (
    <>
      <Timeline
        sections={sections.map((s) => ({ heading: s.heading }))}
        currentSectionIndex={activeSectionIndex}
      />

      {sections.map((section, index) => (
        <div
          key={`${slug}-section-wrapper-${index}`}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
        >
          <ArticleSection
            heading={section.heading}
            body={section.body}
            image={section.image}
            isLast={index === sections.length - 1}
          />
        </div>
      ))}
    </>
  );
}
