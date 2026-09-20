import React from 'react';
import { MessageSquare, Edit2, HelpCircle, CheckCircle2 } from 'lucide-react';
import { PortfolioData } from '../types';
import { themePalettes } from '../utils/theme';

interface SectionFinalReflectionProps {
  data: PortfolioData;
  isEditMode: boolean;
  onEdit: () => void;
}

export const SectionFinalReflection: React.FC<SectionFinalReflectionProps> = ({
  data,
  isEditMode,
  onEdit,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;
  const reflection = data.finalReflection;

  const questions = [
    { key: 'qWhatILearned', label: '1. O que aprendi?', text: reflection.qWhatILearned },
    { key: 'qMostEvolvedArea', label: '2. Em que área evoluí mais?', text: reflection.qMostEvolvedArea },
    { key: 'qMostImportantActivity', label: '3. Qual foi a atividade mais importante para mim?', text: reflection.qMostImportantActivity },
    { key: 'qOvercomeDifficulties', label: '4. Que dificuldades consegui ultrapassar?', text: reflection.qOvercomeDifficulties },
    { key: 'qHowToApply', label: '5. Como poderei aplicar estas aprendizagens?', text: reflection.qHowToApply },
    { key: 'qFutureLearning', label: '6. O que gostaria de continuar a aprender?', text: reflection.qFutureLearning },
  ];

  return (
    <section id="reflexao" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${palette.primaryLightBg} ${palette.primaryText}`}>
            <MessageSquare className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">8. Reflexão final da ação</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Balanço global e resposta às 6 questões orientadoras sobre o percurso na Ação {data.course.actionNumber}
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={onEdit}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl shadow transition flex items-center gap-2 text-xs"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar Reflexão Final</span>
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8 space-y-8">
        
        {/* Balanço Global Box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className={`w-5 h-5 ${palette.primaryText}`} />
            Balanço Global da Formação
          </h3>
          <p className="text-slate-700 dark:text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {reflection.overallReflection || 'Apresente aqui o seu balanço pessoal global sobre a formação.'}
          </p>
        </div>

        {/* 6 Guided Questions Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            Questões Orientadoras de Autoavaliação
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q) => (
              <div
                key={q.key}
                className="bg-slate-50/60 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {q.label}
                </h4>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {q.text || 'Ainda não preenchido. Clique em Editar para responder.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
