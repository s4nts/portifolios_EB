"use client";

import { useMemo } from "react";
import ArticleSection from "./ArticleSection";
import { getPeriodForSection } from "@/lib/periodMapper";
import { PERIODS } from "@/lib/periodMapper";
import { getMonthTheme } from "@/lib/monthThemes";

interface Section {
  heading: string;
  body: string;
  image: string | string[];
}

interface ArticleContentProps {
  sections: Section[];
  slug: string;
}

export default function ArticleContent({
  sections,
  slug,
}: ArticleContentProps) {
  const sectionsByMonth = useMemo(() => {
    const grouped = new Map<
      string,
      Array<Section & { originalIndex: number }>
    >();

    sections.forEach((section, index) => {
      const period = getPeriodForSection(
        section.heading,
        index,
        sections.length
      );
      const monthId =
        period?.id ||
        PERIODS[Math.floor((index / sections.length) * 11)].id;

      if (!grouped.has(monthId)) {
        grouped.set(monthId, []);
      }
      grouped.get(monthId)!.push({ ...section, originalIndex: index });
    });

    const sortedMonths = Array.from(grouped.entries()).sort((a, b) => {
      const periodA = PERIODS.find((p) => p.id === a[0]);
      const periodB = PERIODS.find((p) => p.id === b[0]);
      return (periodA?.order || 0) - (periodB?.order || 0);
    });

    return sortedMonths;
  }, [sections]);

  return (
    <div className="w-full">
      <div>
        {sectionsByMonth.map(([monthId, monthSections], monthIndex) => {
          const period = PERIODS.find((p) => p.id === monthId);
          const theme = getMonthTheme(monthId);

          return (
            <div key={monthId} className="mb-8 group">
              <div
                className={`mb-4 px-4 py-3 rounded-lg transition-all duration-300 ${theme.headerBg} ${theme.headerText} ${theme.headerHover} hover:shadow-md relative overflow-hidden`}
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                                   radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                }}
              >
                <div className="absolute inset-0 opacity-10 text-5xl flex items-center justify-center pointer-events-none select-none">
                  <span className="transform rotate-12">{theme.pattern}</span>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{theme.icon}</span>
                    <div className="text-sm font-semibold">
                      {period?.label || monthId}
                    </div>
                  </div>
                  <div className="text-xs mt-1 opacity-80">
                    {monthSections.length} atividade
                    {monthSections.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div
                className={`space-y-0 rounded-lg p-4 ${theme.sectionBg}`}
              >
                {monthSections.map((section, sectionIndex) => (
                  <div key={`${slug}-section-${section.originalIndex}`}>
                    <ArticleSection
                      heading={section.heading}
                      body={section.body}
                      image={section.image}
                      isLast={
                        monthIndex === sectionsByMonth.length - 1 &&
                        sectionIndex === monthSections.length - 1
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
