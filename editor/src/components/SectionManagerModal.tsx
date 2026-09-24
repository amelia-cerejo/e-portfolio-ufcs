import React from 'react';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import { PortfolioSection } from '../types';
import { normalizeSections, sectionLabels } from '../utils/sections';

interface SectionManagerModalProps {
  isOpen: boolean;
  sections: PortfolioSection[] | undefined;
  onChange: (sections: PortfolioSection[]) => void;
  onClose: () => void;
}

export const SectionManagerModal: React.FC<SectionManagerModalProps> = ({ isOpen, sections, onChange, onClose }) => {
  if (!isOpen) return null;
  const ordered = normalizeSections(sections);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= ordered.length || ordered[index].id === 'capa' || ordered[target].id === 'capa') return;
    const next = [...ordered];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="sections-title" className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 id="sections-title" className="text-lg font-bold">Organizar secções</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-2 overflow-y-auto p-5">
          {ordered.map((section, index) => (
            <div key={section.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
              <label className="flex min-w-0 flex-1 items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={section.visible}
                  disabled={section.id === 'capa'}
                  onChange={() => onChange(ordered.map((item) => item.id === section.id ? { ...item, visible: !item.visible } : item))}
                  className="h-4 w-4 accent-indigo-600"
                />
                <span>{sectionLabels[section.id]}</span>
              </label>
              <button type="button" onClick={() => move(index, -1)} disabled={index <= 1} aria-label={`Subir ${sectionLabels[section.id]}`} className="rounded-md p-2 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(index, 1)} disabled={section.id === 'capa' || index === ordered.length - 1} aria-label={`Descer ${sectionLabels[section.id]}`} className="rounded-md p-2 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"><ArrowDown className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 p-4 text-right dark:border-slate-700">
          <button type="button" onClick={onClose} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Concluído</button>
        </div>
      </div>
    </div>
  );
};
