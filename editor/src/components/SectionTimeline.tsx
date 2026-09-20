import React from 'react';
import { Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { PortfolioData } from '../types';
import { themePalettes } from '../utils/theme';

interface SectionTimelineProps {
  data: PortfolioData;
  onSelectUFCD: (ufcdId: string) => void;
}

export const SectionTimeline: React.FC<SectionTimelineProps> = ({
  data,
  onSelectUFCD,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;

  // Calculate total hours from UFCD list
  const totalHours = data.ufcds.reduce((acc, u) => acc + (u.hours || 0), 0);

  return (
    <section id="percurso" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${palette.primaryLightBg} ${palette.primaryText}`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. O meu percurso</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Visão geral e mapa de sequenciação das 8 UFCD da Ação {data.course.actionNumber}
            </p>
          </div>
        </div>

        {/* Carga Horária Overview */}
        <div className="bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estrutura do Percurso Formativo</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {data.ufcds.length} UFCD ({totalHours} Horas Totais)
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Vertical Timeline Cards */}
      <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {data.ufcds.map((ufcd, index) => {
          return (
            <div key={ufcd.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className="absolute -left-6 md:-left-10 top-2.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 border-indigo-500 text-indigo-500 bg-white dark:bg-slate-900 transition-transform group-hover:scale-110 z-10 font-mono text-[10px] md:text-xs font-bold"
              >
                {index + 1}
              </div>

              {/* Timeline Card */}
              <div
                onClick={() => onSelectUFCD(ufcd.id)}
                className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      UFCD {ufcd.code}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {ufcd.hours} Horas
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {ufcd.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {ufcd.whatILearned || 'Clique para consultar a página e registar aprendizagens.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">
                    {ufcd.evidences ? ufcd.evidences.length : 0} Evidências
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectUFCD(ufcd.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${palette.primaryBg} text-white shadow-sm`}
                  >
                    <span>Consultar UFCD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
