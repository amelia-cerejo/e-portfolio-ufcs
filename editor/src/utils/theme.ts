import { ThemeColor, FontStyle } from '../types';

export interface ThemePalette {
  name: string;
  bgGradient: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  primaryBorder: string;
  primaryLightBg: string;
  badgeBg: string;
  ring: string;
  accent: string;
}

export const themePalettes: Record<ThemeColor, ThemePalette> = {
  indigo: {
    name: 'Azul Formativo',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    primaryBg: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    primaryText: 'text-indigo-600 dark:text-indigo-400',
    primaryBorder: 'border-indigo-600/30',
    primaryLightBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200',
    ring: 'focus:ring-indigo-500',
    accent: '#4f46e5',
  },
  emerald: {
    name: 'Verde Esperança',
    bgGradient: 'from-slate-900 via-emerald-950 to-slate-900',
    primaryBg: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    primaryText: 'text-emerald-600 dark:text-emerald-400',
    primaryBorder: 'border-emerald-600/30',
    primaryLightBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    ring: 'focus:ring-emerald-500',
    accent: '#059669',
  },
  teal: {
    name: 'Turquesa Moderno',
    bgGradient: 'from-slate-900 via-teal-950 to-slate-900',
    primaryBg: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-700',
    primaryText: 'text-teal-600 dark:text-teal-400',
    primaryBorder: 'border-teal-600/30',
    primaryLightBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeBg: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200',
    ring: 'focus:ring-teal-500',
    accent: '#0d9488',
  },
  rose: {
    name: 'Rosa Elegante',
    bgGradient: 'from-slate-900 via-rose-950 to-slate-900',
    primaryBg: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    primaryText: 'text-rose-600 dark:text-rose-400',
    primaryBorder: 'border-rose-600/30',
    primaryLightBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
    ring: 'focus:ring-rose-500',
    accent: '#e11d48',
  },
  amber: {
    name: 'Âmbar Dinâmico',
    bgGradient: 'from-slate-900 via-amber-950 to-slate-900',
    primaryBg: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    primaryText: 'text-amber-600 dark:text-amber-400',
    primaryBorder: 'border-amber-600/30',
    primaryLightBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
    ring: 'focus:ring-amber-500',
    accent: '#d97706',
  },
  slate: {
    name: 'Grafite Sobrio',
    bgGradient: 'from-slate-900 via-slate-800 to-slate-900',
    primaryBg: 'bg-slate-700',
    primaryHover: 'hover:bg-slate-800',
    primaryText: 'text-slate-700 dark:text-slate-300',
    primaryBorder: 'border-slate-600/30',
    primaryLightBg: 'bg-slate-100 dark:bg-slate-800/60',
    badgeBg: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    ring: 'focus:ring-slate-500',
    accent: '#334155',
  },
  violet: {
    name: 'Violeta Criativo',
    bgGradient: 'from-slate-900 via-violet-950 to-slate-900',
    primaryBg: 'bg-violet-600',
    primaryHover: 'hover:bg-violet-700',
    primaryText: 'text-violet-600 dark:text-violet-400',
    primaryBorder: 'border-violet-600/30',
    primaryLightBg: 'bg-violet-50 dark:bg-violet-950/40',
    badgeBg: 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200',
    ring: 'focus:ring-violet-500',
    accent: '#7c3aed',
  },
};

export function getFontClass(fontStyle: FontStyle): string {
  switch (fontStyle) {
    case 'serif':
      return 'font-serif';
    case 'mono':
      return 'font-mono';
    default:
      return 'font-sans';
  }
}
