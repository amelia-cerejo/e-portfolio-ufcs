import React from 'react';
import { Eye, FilePlus, FolderOpen, Palette } from 'lucide-react';

interface PortfolioStartPanelProps {
  onCreateBlank: () => void;
  onLoadExample: () => void;
  onOpenProject: () => void;
  onCustomize: () => void;
}

export const PortfolioStartPanel: React.FC<PortfolioStartPanelProps> = ({
  onCreateBlank,
  onLoadExample,
  onOpenProject,
  onCustomize,
}) => (
  <section aria-labelledby="start-title" className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm dark:border-indigo-900 dark:bg-slate-900 sm:p-6">
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">E-Portefólio digital</p>
        <h2 id="start-title" className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Começar ou continuar</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Escolhe uma opção. O teu trabalho fica guardado neste navegador e pode ser guardado num ficheiro no computador.</p>
      </div>
      <button
        type="button"
        onClick={onCustomize}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-800 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200"
      >
        <Palette className="h-4 w-4" />
        Cores e apresentação
      </button>
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <button type="button" onClick={onCreateBlank} className="group flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-left transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30">
        <FilePlus className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <span><strong className="block text-sm text-slate-900 dark:text-white">Criar em branco</strong><small className="mt-1 block text-slate-600 dark:text-slate-300">Começar com uma UFCD.</small></span>
      </button>
      <button type="button" onClick={onLoadExample} className="group flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50/70 p-4 text-left transition hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/30">
        <Eye className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
        <span><strong className="block text-sm text-slate-900 dark:text-white">Ver exemplo 26109</strong><small className="mt-1 block text-slate-600 dark:text-slate-300">Consultar o modelo preenchido.</small></span>
      </button>
      <button type="button" onClick={onOpenProject} className="group flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-left transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30">
        <FolderOpen className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <span><strong className="block text-sm text-slate-900 dark:text-white">Abrir projeto guardado</strong><small className="mt-1 block text-slate-600 dark:text-slate-300">Escolher um ficheiro .eportfolio.</small></span>
      </button>
    </div>
  </section>
);
