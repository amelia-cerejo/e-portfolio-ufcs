import React from 'react';
import { Award, FileCheck } from 'lucide-react';
import { PortfolioData } from '../types';
import { themePalettes } from '../utils/theme';

interface SectionCertificationProps {
  data: PortfolioData;
}

export const SectionCertification: React.FC<SectionCertificationProps> = ({ data }) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;

  return (
    <section id="certificacao" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-2xl ${palette.primaryLightBg} ${palette.primaryText}`}>
          <Award className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">9. Certificação</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Informação sobre a certificação do percurso formativo
          </p>
        </div>
      </div>

      {/* Main Single Card for Certification */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck className={`w-5 h-5 ${palette.primaryText}`} />
          Certificação do Percurso de Formação
        </h3>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-sm md:text-base leading-relaxed space-y-3">
          <p>
            A conclusão do percurso formativo é comprovada através de um Certificado de Qualificações. A conclusão de apenas parte das UFCD pode dar origem a um Certificado de Qualificações Parcial.
          </p>
        </div>
      </div>
    </section>
  );
};
