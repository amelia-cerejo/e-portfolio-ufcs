import React from 'react';
import { HeartHandshake, Edit2, Mail, Phone, MapPin, Linkedin, Github, Globe, Quote } from 'lucide-react';
import { PortfolioData } from '../types';
import { themePalettes } from '../utils/theme';

interface SectionClosureProps {
  data: PortfolioData;
  isEditMode: boolean;
  onEdit: () => void;
}

export const SectionClosure: React.FC<SectionClosureProps> = ({
  data,
  isEditMode,
  onEdit,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;
  const closure = data.closure;
  const profile = data.profile;

  const hasContacts = Boolean(
    profile.email || profile.phone || profile.location || profile.linkedin || profile.github || profile.website
  );

  return (
    <section id="encerramento" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${palette.primaryLightBg} ${palette.primaryText}`}>
            <HeartHandshake className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">11. Encerramento</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mensagem final, agradecimentos e contactos de encerramento do e-portefólio
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={onEdit}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl shadow transition flex items-center gap-2 text-xs"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar Encerramento</span>
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8 space-y-8">
        
        {/* Final Message */}
        {closure.finalMessage && (
          <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Quote className={`w-4 h-4 ${palette.primaryText}`} />
              Mensagem Final
            </h3>
            <p className="text-slate-800 dark:text-slate-200 text-base italic leading-relaxed whitespace-pre-line">
              "{closure.finalMessage}"
            </p>
          </div>
        )}

        {/* Acknowledgements */}
        {closure.acknowledgements && (
          <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Agradecimentos
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {closure.acknowledgements}
            </p>
          </div>
        )}

        {/* Formando Sign-off & Contact Info */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {profile.studentName || 'Nome do Formando'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              E-Portefólio de Formando — Ação {data.course.actionNumber} ({data.course.entityName})
            </p>
          </div>

          {/* Contacts if present */}
          {hasContacts && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-1 hover:text-indigo-500 transition">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.email}</span>
                </a>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.phone}</span>
                </span>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-500 transition">
                  <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-500 transition">
                  <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
