import React from 'react';
import { TrendingUp, Edit2, CheckCircle2 } from 'lucide-react';
import { PortfolioData } from '../types';
import { themePalettes } from '../utils/theme';

interface SectionSkillEvolutionProps {
  data: PortfolioData;
  isEditMode: boolean;
  onEdit: () => void;
}

export const SectionSkillEvolution: React.FC<SectionSkillEvolutionProps> = ({
  data,
  isEditMode,
  onEdit,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;

  return (
    <section id="evolucao" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${palette.primaryLightBg} ${palette.primaryText}`}>
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">7. Evolução das competências</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Autoavaliação comparativa do nível inicial e final nas 7 áreas chave de desenvolvimento
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={onEdit}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl shadow transition flex items-center gap-2 text-xs"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar Níveis de Evolução</span>
          </button>
        )}
      </div>

      {/* Skills Evolution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.skillEvolutions.map((skill) => {
          const initialPct = (skill.initialLevel / 10) * 100;
          const finalPct = (skill.finalLevel / 10) * 100;
          const diff = skill.finalLevel - skill.initialLevel;

          return (
            <div
              key={skill.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white capitalize">
                    {skill.category}
                  </h3>
                  {diff > 0 && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      +{diff} Níveis
                    </span>
                  )}
                </div>

                {/* Progress Bars Comparison */}
                <div className="space-y-2 text-xs">
                  {/* Initial Bar */}
                  <div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span>Nível Inicial:</span>
                      <span className="font-bold">{skill.initialLevel} / 10</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-400 dark:bg-slate-600 h-full rounded-full"
                        style={{ width: `${initialPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Final Bar */}
                  <div>
                    <div className="flex justify-between text-slate-900 dark:text-white font-semibold mb-1">
                      <span>Nível Atual / Final:</span>
                      <span className="font-extrabold text-emerald-500">{skill.finalLevel} / 10</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${finalPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {skill.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-2 border-t border-slate-100 dark:border-slate-800">
                    "{skill.notes}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
