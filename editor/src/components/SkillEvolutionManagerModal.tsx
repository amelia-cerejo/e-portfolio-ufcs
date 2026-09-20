import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Check, Plus, Trash2 } from 'lucide-react';
import { SkillEvolution } from '../types';

interface SkillEvolutionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillEvolutions: SkillEvolution[];
  onSave: (skillEvolutions: SkillEvolution[]) => void;
}

export const SkillEvolutionManagerModal: React.FC<SkillEvolutionManagerModalProps> = ({
  isOpen,
  onClose,
  skillEvolutions,
  onSave,
}) => {
  const [draftList, setDraftList] = useState<SkillEvolution[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDraftList(skillEvolutions ? JSON.parse(JSON.stringify(skillEvolutions)) : []);
    }
  }, [isOpen, skillEvolutions]);

  if (!isOpen) return null;

  const handleUpdate = (index: number, field: keyof SkillEvolution, value: any) => {
    setDraftList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddCategory = () => {
    const newItem: SkillEvolution = {
      id: `se_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      category: 'Nova Área de Competência',
      initialLevel: 3,
      finalLevel: 8,
      notes: 'Justificação e reflexão sobre a evolução nesta competência.',
    };
    setDraftList((prev) => [...prev, newItem]);
  };

  const handleDeleteCategory = (index: number) => {
    setDraftList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    onSave(draftList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Editar Níveis de Evolução das Competências
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ajuste os níveis inicial/final (1 a 10) e adicione as suas reflexões
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Áreas de Avaliação ({draftList.length})
            </h4>
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold text-xs rounded-xl hover:bg-indigo-100 transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Área</span>
            </button>
          </div>

          <div className="space-y-4">
            {draftList.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => handleUpdate(index, 'category', e.target.value)}
                    placeholder="Nome da área"
                    className="flex-1 font-bold text-sm px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(index)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    title="Eliminar esta área"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {/* Initial Level */}
                  <div>
                    <label className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      <span>Nível Inicial:</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{item.initialLevel} / 10</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={item.initialLevel}
                      onChange={(e) => handleUpdate(index, 'initialLevel', Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Final Level */}
                  <div>
                    <label className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      <span>Nível Atual / Final:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{item.finalLevel} / 10</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={item.finalLevel}
                      onChange={(e) => handleUpdate(index, 'finalLevel', Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Justificação e Observações da Evolução:
                  </label>
                  <textarea
                    rows={2}
                    value={item.notes}
                    onChange={(e) => handleUpdate(index, 'notes', e.target.value)}
                    placeholder="Descreva o que motivou este progresso..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Níveis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
