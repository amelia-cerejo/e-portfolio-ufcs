import React from 'react';
import { GraduationCap, Building, Clock, Calendar, Users, Target, Layers, MapPin, Bookmark, Edit2, CheckCircle2 } from 'lucide-react';
import { PortfolioData } from '../types';
import { themePalettes } from '../utils/theme';

interface SectionCourseProps {
  data: PortfolioData;
  isEditMode: boolean;
  onEdit: () => void;
}

export const SectionCourse: React.FC<SectionCourseProps> = ({
  data,
  isEditMode,
  onEdit,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;
  const course = data.course;

  const generalObjs = Array.isArray(course.generalObjectives)
    ? course.generalObjectives
    : [course.generalObjectives];

  const specificObjs = Array.isArray(course.specificObjectives)
    ? course.specificObjectives
    : [];

  return (
    <section id="formacao" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${palette.primaryLightBg} ${palette.primaryText}`}>
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. A minha formação</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Dados gerais da ação de formação, enquadramento, entidade e objetivos pedagógicos
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={onEdit}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl shadow transition flex items-center gap-2 text-xs"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar "A minha formação"</span>
          </button>
        )}
      </div>

      {/* Main Grid: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Ação & Programa */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className={`w-4 h-4 ${palette.primaryText}`} />
            Ação de Formação
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {course.actionNumber ? `N.º ${course.actionNumber}` : 'Por preencher'}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 font-bold">
            {course.actionTitle || 'Título da formação por preencher'}
          </p>
          {course.program && (
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Programa: {course.program}
            </span>
          )}
        </div>

        {/* Card 2: Entidade & Localização */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Building className={`w-4 h-4 ${palette.primaryText}`} />
            Entidade Formadora
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
            {course.entityName}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1">
            <p>Regime: <span className="font-semibold text-slate-700 dark:text-slate-200">{course.modality}</span></p>
            {course.location && (
              <p className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{course.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Card 3: Duração & Área */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Clock className={`w-4 h-4 ${palette.primaryText}`} />
            Duração & Carga
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {course.duration || 'Duração por preencher'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {data.ufcds.length} Unidades de Formação (UFCD)
          </p>
          {course.trainingArea && (
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              Área: {course.trainingArea}
            </p>
          )}
        </div>

        {/* Card 4: Início & Formadores */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Calendar className={`w-4 h-4 ${palette.primaryText}`} />
            Cronograma & Formadores
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Data de início: {course.startDate || 'por preencher'}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1 pt-1">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>Formadores: {course.trainerName || 'por preencher'}</span>
          </p>
        </div>
      </div>

      {/* Framing Banner */}
      {course.framing && (
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Bookmark className="w-4 h-4" />
            Enquadramento da Formação
          </div>
          <p className="text-slate-200 text-sm md:text-base leading-relaxed">
            {course.framing}
          </p>
        </div>
      )}

      {/* Objectives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* General Objectives */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className={`w-5 h-5 ${palette.primaryText}`} />
            Objetivos Gerais
          </h3>

          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {generalObjs.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Specific Objectives */}
        {specificObjs.length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Objetivos Específicos
            </h3>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {specificObjs.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${palette.primaryBg} shrink-0 mt-1.5`} />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
