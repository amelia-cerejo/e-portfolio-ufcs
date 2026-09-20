import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Heart, Check } from 'lucide-react';

interface InterestsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  interests: string[];
  onSave: (interests: string[]) => void;
}

export const InterestsManagerModal: React.FC<InterestsManagerModalProps> = ({
  isOpen,
  onClose,
  interests,
  onSave,
}) => {
  const [draftInterests, setDraftInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDraftInterests(interests ? [...interests] : []);
      setNewInterest('');
    }
  }, [isOpen, interests]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newInterest.trim()) return;
    setDraftInterests((prev) => [...prev, newInterest.trim()]);
    setNewInterest('');
  };

  const handleUpdate = (index: number, value: string) => {
    setDraftInterests((prev) =>
      prev.map((item, idx) => (idx === index ? value : item))
    );
  };

  const handleDelete = (index: number) => {
    setDraftInterests((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setDraftInterests((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= draftInterests.length - 1) return;
    setDraftInterests((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleSave = () => {
    onSave(draftInterests.filter((item) => item.trim() !== ''));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Editar Áreas de Interesse
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adicione, edite, ordene ou remova as suas áreas de interesse
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
          
          {/* Form to Add New Interest */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Adicionar Nova Área de Interesse
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Inteligência Artificial, Fotografia, Programação Web..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
              />

              <button
                type="button"
                onClick={handleAdd}
                disabled={!newInterest.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>

          {/* List of Current Interests */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lista de Interesses ({draftInterests.length})
            </h4>

            {draftInterests.length > 0 ? (
              <div className="space-y-2">
                {draftInterests.map((item, index) => (
                  <div
                    key={index}
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
                        disabled={index === draftInterests.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Interest Text Input */}
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleUpdate(index, e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-rose-500 outline-none"
                    />

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      title="Eliminar interesse"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                Nenhuma área de interesse adicionada.
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
