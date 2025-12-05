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
 * Componente de timeline/roadmap visual mostrando quando cada atividade ocorreu
 */
export default function Timeline({
  sections,
  currentSectionIndex,
}: TimelineProps) {
  // Mapeia cada seção para seu período
  const sectionsWithPeriods = useMemo(() => {
    return sections.map((section, index) => ({
      ...section,
      index,
      period: getPeriodForSection(section.heading),
    }));
  }, [sections]);

  // Obtém todos os períodos únicos que aparecem nas seções
  const activePeriods = useMemo(() => {
    const periodMap = new Map<string, Period>();
    
    sectionsWithPeriods.forEach((section) => {
      if (section.period) {
        periodMap.set(section.period.id, section.period);
      }
    });

    // Se há períodos específicos, mostra eles + períodos intermediários para contexto
    if (periodMap.size > 0) {
      const periods = Array.from(periodMap.values()).sort((a, b) => a.order - b.order);
      const firstPeriod = periods[0];
      const lastPeriod = periods[periods.length - 1];
      
      // Inclui todos os períodos do primeiro ao último
      const allPeriods = PERIODS.filter(
        (p) => p.order >= firstPeriod.order && p.order <= lastPeriod.order
      );
      
      return allPeriods;
    }

    // Se não há períodos específicos, mostra todos os meses do ano letivo
    return PERIODS.filter((p) => p.order >= 1 && p.order <= 11);
  }, [sectionsWithPeriods]);

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

  // Scroll para o período atual quando o componente monta ou currentSectionIndex muda
  const currentPeriod = useMemo(() => {
    if (currentSectionIndex === undefined) return null;
    return sectionsWithPeriods[currentSectionIndex]?.period;
  }, [currentSectionIndex, sectionsWithPeriods]);

  if (activePeriods.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-12 bg-gradient-to-b from-slate-50 to-white rounded-lg p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">
        Linha do Tempo - Ano Letivo 2025
      </h3>
      
      <div className="relative overflow-x-auto pb-4">
        <div className="flex items-start gap-1 min-w-max px-2">
          {activePeriods.map((period, periodIndex) => {
            const isActive = currentPeriod?.id === period.id;
            const hasSections = sectionsByPeriod.has(period.id);
            const sectionsInPeriod = sectionsByPeriod.get(period.id) || [];
            const isPast = currentPeriod && 
              activePeriods.findIndex((p) => p.id === currentPeriod.id) > periodIndex;

            return (
              <div
                key={period.id}
                className="flex flex-col items-center flex-1 min-w-[70px] max-w-[100px]"
              >
                {/* Mês/Período */}
                <div
                  className={`w-full text-center mb-3 px-2 py-2.5 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold shadow-lg scale-105 ring-2 ring-blue-300"
                      : hasSections
                      ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 font-medium shadow-sm hover:shadow-md"
                      : isPast
                      ? "bg-slate-200 text-slate-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <div className="text-sm font-bold">{period.label}</div>
                  {hasSections && (
                    <div className={`text-xs mt-1 ${
                      isActive ? "opacity-90" : "opacity-70"
                    }`}>
                      {sectionsInPeriod.length} atividade{sectionsInPeriod.length > 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* Linha conectora */}
                {periodIndex < activePeriods.length - 1 && (
                  <div className="flex-1 w-full flex items-center relative -mt-3">
                    <div
                      className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                        isActive || isPast
                          ? "bg-gradient-to-r from-blue-400 to-blue-500"
                          : "bg-slate-300"
                      }`}
                    />
                    <div
                      className={`absolute right-0 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        isActive || isPast
                          ? "bg-blue-500 border-blue-400 shadow-md"
                          : "bg-white border-slate-300"
                      } transform translate-x-1/2`}
                    />
                  </div>
                )}

                {/* Indicador de posição atual */}
                {isActive && (
                  <div className="mt-1 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-transparent border-t-blue-500 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legenda de atividades por período */}
      {currentPeriod && sectionsByPeriod.has(currentPeriod.id) && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-2">
            Atividades em {currentPeriod.label}:
          </p>
          <ul className="text-sm text-slate-600 space-y-1">
            {sectionsByPeriod.get(currentPeriod.id)?.map((section) => (
              <li key={section.index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className={section.index === currentSectionIndex ? "font-semibold text-blue-700" : ""}>
                  {section.heading}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

