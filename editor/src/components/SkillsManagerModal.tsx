import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Code, Check } from 'lucide-react';
import { SkillItem } from '../types';

interface SkillsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: SkillItem[];
  onSave: (skills: SkillItem[]) => void;
}

export const SkillsManagerModal: React.FC<SkillsManagerModalProps> = ({
  isOpen,
  onClose,
  skills,
  onSave,
}) => {
  const [draftSkills, setDraftSkills] = useState<SkillItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'digital' | 'soft' | 'technical'>('digital');

  useEffect(() => {
    if (isOpen) {
      setDraftSkills(skills ? JSON.parse(JSON.stringify(skills)) : []);
      setNewName('');
      setNewCategory('digital');
    }
  }, [isOpen, skills]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newName.trim()) return;
    const item: SkillItem = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: newName.trim(),
      category: newCategory,
    };
    setDraftSkills((prev) => [...prev, item]);
    setNewName('');
  };

  const handleUpdateName = (index: number, name: string) => {
    setDraftSkills((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, name } : s))
    );
  };

  const handleUpdateCategory = (index: number, category: 'digital' | 'soft' | 'technical') => {
    setDraftSkills((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, category } : s))
    );
  };

  const handleDelete = (index: number) => {
    setDraftSkills((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setDraftSkills((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= draftSkills.length - 1) return;
    setDraftSkills((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleSave = () => {
    onSave(draftSkills);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Editar Competências Chave
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adicione, altere, ordene ou remova as suas competências
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Form to Add New Skill */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Adicionar Nova Competência
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Ex: Gestão de Documentos Cloud, React, Trabalho em Equipa..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as 'digital' | 'soft' | 'technical')}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="digital">Digital</option>
                <option value="soft">Soft Skill</option>
                <option value="technical">Técnica</option>
              </select>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>

          {/* List of Current Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lista de Competências ({draftSkills.length})
            </h4>

            {draftSkills.length > 0 ? (
              <div className="space-y-2">
                {draftSkills.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm"
                  >
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === draftSkills.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Skill Text Input */}
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateName(index, e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    />

                    {/* Category Select */}
                    <select
                      value={item.category || 'digital'}
                      onChange={(e) => handleUpdateCategory(index, e.target.value as 'digital' | 'soft' | 'technical')}
                      className="px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
                    >
                      <option value="digital">Digital</option>
                      <option value="soft">Soft Skill</option>
                      <option value="technical">Técnica</option>
                    </select>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      title="Eliminar competência"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                Nenhuma competência adicionada. Adicione competências acima.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer (Save & Cancel) */}
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
            <span>Guardar Alterações</span>
          </button>
        </div>
      </div>
    </div>
  );
};
