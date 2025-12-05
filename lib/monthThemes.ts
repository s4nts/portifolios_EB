export interface MonthTheme {
  id: string;
  headerBg: string;
  headerText: string;
  headerHover: string;
  sectionBg: string;
  pattern: string;
  icon: string;
}

export const MONTH_THEMES: Record<string, MonthTheme> = {
  fevereiro: {
    id: "fevereiro",
    headerBg: "bg-sky-100",
    headerText: "text-sky-900",
    headerHover: "hover:bg-sky-200",
    sectionBg: "bg-sky-50/30",
    pattern: "🎒📚",
    icon: "📚",
  },
  marco: {
    id: "marco",
    headerBg: "bg-amber-100",
    headerText: "text-amber-900",
    headerHover: "hover:bg-amber-200",
    sectionBg: "bg-amber-50/30",
    pattern: "🍂🍁",
    icon: "🍂",
  },
  abril: {
    id: "abril",
    headerBg: "bg-pink-100",
    headerText: "text-pink-900",
    headerHover: "hover:bg-pink-200",
    sectionBg: "bg-pink-50/30",
    pattern: "🐰🥚",
    icon: "🐰",
  },
  maio: {
    id: "maio",
    headerBg: "bg-rose-100",
    headerText: "text-rose-900",
    headerHover: "hover:bg-rose-200",
    sectionBg: "bg-rose-50/30",
    pattern: "🌹💐",
    icon: "🌹",
  },
  junho: {
    id: "junho",
    headerBg: "bg-orange-100",
    headerText: "text-orange-900",
    headerHover: "hover:bg-orange-200",
    sectionBg: "bg-orange-50/30",
    pattern: "🎪🎈",
    icon: "🎪",
  },
  julho: {
    id: "julho",
    headerBg: "bg-cyan-100",
    headerText: "text-cyan-900",
    headerHover: "hover:bg-cyan-200",
    sectionBg: "bg-cyan-50/30",
    pattern: "❄️⛄",
    icon: "❄️",
  },
  agosto: {
    id: "agosto",
    headerBg: "bg-indigo-100",
    headerText: "text-indigo-900",
    headerHover: "hover:bg-indigo-200",
    sectionBg: "bg-indigo-50/30",
    pattern: "🛠️🎁",
    icon: "🛠️",
  },
  setembro: {
    id: "setembro",
    headerBg: "bg-emerald-100",
    headerText: "text-emerald-900",
    headerHover: "hover:bg-emerald-200",
    sectionBg: "bg-emerald-50/30",
    pattern: "🌸🦋",
    icon: "🌸",
  },
  outubro: {
    id: "outubro",
    headerBg: "bg-violet-100",
    headerText: "text-violet-900",
    headerHover: "hover:bg-violet-200",
    sectionBg: "bg-violet-50/30",
    pattern: "🎈🎮",
    icon: "🎈",
  },
  novembro: {
    id: "novembro",
    headerBg: "bg-yellow-100",
    headerText: "text-yellow-900",
    headerHover: "hover:bg-yellow-200",
    sectionBg: "bg-yellow-50/30",
    pattern: "✊🌟",
    icon: "✊",
  },
  dezembro: {
    id: "dezembro",
    headerBg: "bg-red-100",
    headerText: "text-red-900",
    headerHover: "hover:bg-red-200",
    sectionBg: "bg-red-50/30",
    pattern: "🎄⭐",
    icon: "🎄",
  },
};

export function getMonthTheme(monthId: string): MonthTheme {
  return MONTH_THEMES[monthId] || MONTH_THEMES.fevereiro;
}
