import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Save, Settings, Layers, FolderCheck } from 'lucide-react';
import { PortfolioData, CourseInfo, UFCD } from '../types';

interface UFCDManagerModalProps {
  data: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
  onSaveCourseInfo: (info: CourseInfo) => void;
  onAddUfcd: (ufcd: Omit<UFCD, 'id' | 'evidences'>) => void;
  onDeleteUfcd: (ufcdId: string) => void;
}

export const UFCDManagerModal: React.FC<UFCDManagerModalProps> = ({
  data,
  isOpen,
  onClose,
  onSaveCourseInfo,
  onAddUfcd,
  onDeleteUfcd,
}) => {
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({ ...data.course });

  // New UFCD Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newHours, setNewHours] = useState(25);
  const [newTrainer, setNewTrainer] = useState('');

  if (!isOpen) return null;

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCourseInfo(courseInfo);
    alert('Dados da Ação de Formação atualizados!');
  };

  const handleCreateUfcd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    onAddUfcd({
      code: newCode,
      name: newName,
      hours: newHours,
      status: 'in_progress',
      trainer: newTrainer || courseInfo.trainerName,
      whatILearned: '',
      activitiesDone: '',
      difficultiesFaced: '',
      howIOvercame: '',
      skillsDeveloped: '',
      finalReflection: '',
    });

    setNewCode('');
    setNewName('');
    setNewHours(25);
    setNewTrainer('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Gestão de Ação de Formação & Lista de UFCDs
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto text-xs">
          
          {/* Section 1: Course Action Info */}
          <form onSubmit={handleSaveCourse} className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              1. Identificação da Ação de Formação
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número da Ação
                </label>
                <input
                  type="text"
                  value={courseInfo.actionNumber}
                  onChange={(e) => setCourseInfo({ ...courseInfo, actionNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designação da Ação
                </label>
                <input
                  type="text"
                  value={courseInfo.actionTitle}
                  onChange={(e) => setCourseInfo({ ...courseInfo, actionTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Entidade Formadora
                </label>
                <input
                  type="text"
                  value={courseInfo.entityName}
                  onChange={(e) => setCourseInfo({ ...courseInfo, entityName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Modalidade & Duração
                </label>
                <input
                  type="text"
                  value={courseInfo.duration}
                  onChange={(e) => setCourseInfo({ ...courseInfo, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Dados da Ação</span>
            </button>
          </form>

          {/* Section 2: UFCDs List */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-emerald-500" />
              2. Unidades de Formação (UFCD) Configuradas ({data.ufcds.length})
            </h4>

            <div className="space-y-2">
              {data.ufcds.map((ufcd) => (
                <div
                  key={ufcd.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      UFCD {ufcd.code}
                    </span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">{ufcd.name}</h5>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{ufcd.hours} Horas — {ufcd.trainer || 'Formador Geral'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Eliminar UFCD ${ufcd.code}?`)) {
                        onDeleteUfcd(ufcd.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    title="Eliminar UFCD"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Add New UFCD */}
          <form onSubmit={handleCreateUfcd} className="space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Nova UFCD a esta Ação
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Código UFCD
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 0753"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome da UFCD
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sistemas operativos: utilitários complementares"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Carga Horária (Horas)
                </label>
                <input
                  type="number"
                  value={newHours}
                  onChange={(e) => setNewHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Formador(a) da UFCD
                </label>
                <input
                  type="text"
                  placeholder="Ex: Prof. Carlos Martins"
                  value={newTrainer}
                  onChange={(e) => setNewTrainer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar UFCD</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
