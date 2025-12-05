"use client";

import { useMemo } from "react";
import { PERIODS, getPeriodForSection, Period } from "@/lib/periodMapper";

interface Section {
  heading: string;
}

interface TimelineProps {
  sections: Section[];
  currentSectionIndex?: number;
}

/**
 * Componente de timeline vertical simples que acende quando passa por ela
 */
export default function Timeline({
  sections,
  currentSectionIndex,
}: TimelineProps) {
  // Mapeia cada seção para seu período
  const sectionsWithPeriods = useMemo(() => {
    return sections.map((section, index) => {
      const period = getPeriodForSection(section.heading, index, sections.length);
      return {
        ...section,
        index,
        period: period || PERIODS[Math.floor((index / sections.length) * 11)],
      };
    });
  }, [sections]);

  // Obtém todos os períodos do ano letivo (fev-dez)
  const allPeriods = useMemo(() => {
    return PERIODS.filter((p) => p.order >= 1 && p.order <= 11);
  }, []);

  // Agrupa seções por período
  const sectionsByPeriod = useMemo(() => {
    const grouped = new Map<string, Array<{ heading: string; index: number }>>();
    
    sectionsWithPeriods.forEach((section) => {
      if (section.period) {
        const periodId = section.period.id;
        if (!grouped.has(periodId)) {
          grouped.set(periodId, []);
        }
        grouped.get(periodId)!.push({ heading: section.heading, index: section.index });
      }
    });

    return grouped;
  }, [sectionsWithPeriods]);

  // Período atual baseado na seção visível
  const currentPeriod = useMemo(() => {
    if (currentSectionIndex === undefined) return null;
    return sectionsWithPeriods[currentSectionIndex]?.period;
  }, [currentSectionIndex, sectionsWithPeriods]);

  return (
    <div className="w-full mb-12">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">
        Linha do Tempo - Ano Letivo 2025
      </h3>
      
      <div className="relative flex flex-col items-center gap-2">
        {allPeriods.map((period, periodIndex) => {
          const isActive = currentPeriod?.id === period.id;
          const hasSections = sectionsByPeriod.has(period.id);
          const sectionsInPeriod = sectionsByPeriod.get(period.id) || [];
          const isPast = currentPeriod && 
            allPeriods.findIndex((p) => p.id === currentPeriod.id) > periodIndex;

          return (
            <div
              key={period.id}
              className="flex items-center gap-4 w-full"
            >
              {/* Linha vertical à esquerda */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-blue-500 shadow-lg shadow-blue-500/50 scale-125"
                      : isPast
                      ? "bg-blue-400"
                      : hasSections
                      ? "bg-blue-200"
                      : "bg-slate-300"
                  }`}
                />
                {periodIndex < allPeriods.length - 1 && (
                  <div
                    className={`w-0.5 transition-all duration-300 ${
                      isActive || isPast
                        ? "bg-blue-400 h-12"
                        : "bg-slate-300 h-12"
                    }`}
                  />
                )}
              </div>

              {/* Mês/Período */}
              <div
                className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-blue-500 text-white font-semibold shadow-md"
                    : isPast
                    ? "bg-blue-100 text-blue-700"
                    : hasSections
                    ? "bg-slate-100 text-slate-700"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                <div className="text-sm font-medium">{period.label}</div>
                {hasSections && sectionsInPeriod.length > 0 && (
                  <div className="text-xs mt-1 opacity-75">
                    {sectionsInPeriod.length} atividade{sectionsInPeriod.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
