/**
 * Mapeia seções de artigos para períodos do ano letivo
 */

export interface Period {
  id: string;
  label: string;
  month: number; // 1-12
  order: number; // Ordem cronológica
}

export const PERIODS: Period[] = [
  { id: "fevereiro", label: "Fev", month: 2, order: 1 },
  { id: "marco", label: "Mar", month: 3, order: 2 },
  { id: "abril", label: "Abr", month: 4, order: 3 },
  { id: "maio", label: "Mai", month: 5, order: 4 },
  { id: "junho", label: "Jun", month: 6, order: 5 },
  { id: "julho", label: "Jul", month: 7, order: 6 },
  { id: "agosto", label: "Ago", month: 8, order: 7 },
  { id: "setembro", label: "Set", month: 9, order: 8 },
  { id: "outubro", label: "Out", month: 10, order: 9 },
  { id: "novembro", label: "Nov", month: 11, order: 10 },
  { id: "dezembro", label: "Dez", month: 12, order: 11 },
];

/**
 * Mapeia o título de uma seção para um período do ano
 */
export function getPeriodForSection(heading: string): Period | null {
  const headingUpper = heading.toUpperCase();

  // Eventos específicos com datas conhecidas
  if (headingUpper.includes("1º DIA DE AULA") || headingUpper.includes("MEU 1º DIA")) {
    return PERIODS.find((p) => p.id === "fevereiro") || PERIODS[0];
  }

  if (headingUpper.includes("PÁSCOA")) {
    return PERIODS.find((p) => p.id === "abril") || PERIODS[2];
  }

  if (headingUpper.includes("DIA DAS MÃES") || headingUpper.includes("DIA DAS MAES")) {
    return PERIODS.find((p) => p.id === "maio") || PERIODS[3];
  }

  if (headingUpper.includes("JUNINO") || headingUpper.includes("JUNINA")) {
    return PERIODS.find((p) => p.id === "junho") || PERIODS[4];
  }

  if (headingUpper.includes("DIA DOS PAIS")) {
    return PERIODS.find((p) => p.id === "agosto") || PERIODS[6];
  }

  if (headingUpper.includes("PRIMAVERA")) {
    return PERIODS.find((p) => p.id === "setembro") || PERIODS[7];
  }

  if (headingUpper.includes("DIA DAS CRIANÇAS") || headingUpper.includes("DIA DAS CRIANCAS")) {
    return PERIODS.find((p) => p.id === "outubro") || PERIODS[8];
  }

  if (headingUpper.includes("CONSCIÊNCIA NEGRA") || headingUpper.includes("CONSCIENCIA NEGRA")) {
    return PERIODS.find((p) => p.id === "novembro") || PERIODS[9];
  }

  if (headingUpper.includes("NATAL")) {
    return PERIODS.find((p) => p.id === "dezembro") || PERIODS[10];
  }

  // Atividades gerais - distribuir ao longo do ano baseado na ordem
  // Retorna null para atividades que não têm período específico
  return null;
}

/**
 * Obtém todos os períodos únicos de uma lista de seções
 */
export function getUniquePeriodsFromSections(
  sections: Array<{ heading: string }>
): Period[] {
  const periodMap = new Map<string, Period>();

  sections.forEach((section) => {
    const period = getPeriodForSection(section.heading);
    if (period) {
      periodMap.set(period.id, period);
    }
  });

  // Adiciona períodos intermediários se houver gaps grandes
  const periods = Array.from(periodMap.values()).sort((a, b) => a.order - b.order);
  
  // Preenche gaps entre períodos conhecidos
  const filledPeriods: Period[] = [];
  periods.forEach((period, index) => {
    filledPeriods.push(period);
    
    // Se há um gap de mais de 2 meses, adiciona períodos intermediários
    if (index < periods.length - 1) {
      const nextPeriod = periods[index + 1];
      const gap = nextPeriod.order - period.order;
      
      if (gap > 2) {
        // Adiciona períodos intermediários
        for (let i = period.order + 1; i < nextPeriod.order; i++) {
          const intermediatePeriod = PERIODS.find((p) => p.order === i);
          if (intermediatePeriod && !filledPeriods.find((p) => p.id === intermediatePeriod.id)) {
            filledPeriods.push(intermediatePeriod);
          }
        }
      }
    }
  });

  // Se não há períodos, retorna todos os meses do ano letivo (fev-dez)
  if (filledPeriods.length === 0) {
    return PERIODS.filter((p) => p.order >= 1 && p.order <= 11);
  }

  return filledPeriods.sort((a, b) => a.order - b.order);
}

