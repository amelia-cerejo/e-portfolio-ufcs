import React from 'react';
import { Edit2, Sparkles, Calendar, Building, Award, Quote, CheckCircle2, User } from 'lucide-react';
import { PortfolioData } from '../types';
import { themePalettes, getFontClass } from '../utils/theme';

interface SectionCoverProps {
  data: PortfolioData;
  isEditMode: boolean;
  onEdit: () => void;
}

export const SectionCover: React.FC<SectionCoverProps> = ({
  data,
  isEditMode,
  onEdit,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;
  const fontClass = getFontClass(data.theme.fontStyle);
  const isTraining = data.templateId === 'eportfolio_training' || Boolean(data.course.actionNumber);

  const bannerImg = data.theme.customBannerUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80';
  const profileImg = data.profile.studentPhoto || '';

  const periodText = data.course.endDate && data.course.endDate.trim() !== ''
    ? `${data.course.startDate} a ${data.course.endDate}`
    : data.course.startDate ? `Início em ${data.course.startDate}` : '';

  return (
    <section id="capa" className={`relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-all ${fontClass}`}>
      {/* Background Banner Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img
          src={bannerImg}
          alt="Banner de Capa"
          className="w-full h-full object-cover object-center filter brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Floating Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex flex-wrap justify-between items-center gap-3 text-white">
          <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold tracking-wider uppercase">E-Portefólio Digital</span>
          </div>

          {data.course.entityName && <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-medium">
            <Building className="w-3.5 h-3.5 text-slate-200" />
            <span>{data.course.entityName}</span>
          </div>}
        </div>

        {/* Edit Button in Cover Header */}
        {isEditMode && (
          <button
            onClick={onEdit}
            className="absolute top-6 right-6 z-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl shadow-lg transition flex items-center gap-2 text-xs"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar Capa</span>
          </button>
        )}
      </div>

      {/* Main Cover Content */}
      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 pb-10 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          
          {/* Profile Photo Avatar */}
          <div className="relative group">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {profileImg ? (
                <img
                  src={profileImg}
                  alt={data.profile.studentName || 'Formando'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-3 text-center">
                  <User className="w-16 h-16 md:w-20 md:h-20 stroke-[1.5]" />
                  <span className="text-[10px] font-semibold mt-1">Sem Fotografia</span>
                </div>
              )}
            </div>
            {isTraining && <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900" title="Formando Ativo">
              <CheckCircle2 className="w-5 h-5" />
            </div>}
          </div>

          {/* Title & Action Badges */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {data.course.actionNumber && <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${palette.badgeBg}`}>
                <Award className="w-3.5 h-3.5" />
                Ação {data.course.actionNumber}
              </span>}
              {data.course.duration && <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {data.course.duration}
              </span>}
              {data.course.modality && <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {data.course.modality}
              </span>}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {data.profile.studentName || 'Nome do Formando'}
            </h1>

            {data.course.actionTitle && <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300">
              {data.course.actionTitle}
            </p>}
          </div>

          {/* Period & Entity Quick Card */}
          {(periodText || data.course.entityName) && <div className="w-full md:w-auto bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300">
            {periodText && <>
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${palette.primaryText}`} />
              <span className="font-semibold">{isTraining ? 'Período de Formação:' : 'Período:'}</span>
            </div>
            <p className="text-slate-900 dark:text-white font-medium pl-6">
              {periodText}
            </p>
            </>}
            {data.course.entityName && <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
              <Building className={`w-4 h-4 ${palette.primaryText}`} />
              <span className="truncate max-w-[200px]" title={data.course.entityName}>
                {data.course.entityName}
              </span>
            </div>}
          </div>}
        </div>

        {/* Presentation Phrase / Motto */}
        {data.profile.presentationPhrase && (
          <div className="mt-6 bg-gradient-to-r from-slate-50 via-slate-100/80 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-start gap-4">
            <Quote className={`w-8 h-8 ${palette.primaryText} shrink-0 opacity-80`} />
            <div>
              <p className="text-slate-800 dark:text-slate-200 italic font-medium text-base md:text-lg leading-relaxed">
                "{data.profile.presentationPhrase}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                — Frase de Apresentação & Visão de Aprendizagem
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
