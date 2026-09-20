import React from 'react';
import { User, Edit2, Target, Briefcase, Heart, Code, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { PortfolioData } from '../types';
import { themePalettes } from '../utils/theme';

interface SectionAboutProps {
  data: PortfolioData;
  isEditMode: boolean;
  onEdit: () => void;
  onEditSkills?: () => void;
  onEditInterests?: () => void;
}

export const SectionAbout: React.FC<SectionAboutProps> = ({
  data,
  isEditMode,
  onEdit,
  onEditSkills,
  onEditInterests,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;
  const profile = data.profile;

  return (
    <section id="sobre" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${palette.primaryLightBg} ${palette.primaryText}`}>
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Sobre mim</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Apresentação pessoal, percurso, competências, interesses e objetivos para a formação
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={onEdit}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl shadow transition flex items-center gap-2 text-xs"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar "Sobre mim"</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Bio & Background (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Box */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className={`w-5 h-5 ${palette.primaryText}`} />
              Breve Apresentação
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {profile.bio || 'Adicione uma breve apresentação sobre si e os seus interesses.'}
            </p>
          </div>

          {/* Background Box */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              Percurso Pessoal ou Profissional
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {profile.background || 'Resuma o seu percurso escolar, pessoal ou profissional.'}
            </p>
          </div>

          {/* Course Objectives Box */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              Objetivos para a Formação
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {profile.courseObjectives || 'Indique o que pretende alcançar com a realização desta ação de formação.'}
            </p>
          </div>
        </div>

        {/* Right Column: Skills, Interests & Optional Contacts */}
        <div className="space-y-6">
          {/* Competências */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code className={`w-4 h-4 ${palette.primaryText}`} />
                Competências Chave
              </h3>

              {isEditMode && onEditSkills && (
                <button
                  onClick={onEditSkills}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1"
                  title="Editar competências chave"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {s.name}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">Nenhuma competência especificada.</p>
              )}
            </div>
          </div>

          {/* Interesses */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Áreas de Interesse
              </h3>

              {isEditMode && onEditInterests && (
                <button
                  onClick={onEditInterests}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1"
                  title="Editar áreas de interesse"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">Nenhum interesse especificado.</p>
              )}
            </div>
          </div>

          {/* Optional Contacts Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Contactos Profissionais (Opcional)
            </h3>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {profile.email ? (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:underline truncate">
                    {profile.email}
                  </a>
                </div>
              ) : null}

              {profile.phone ? (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              ) : null}

              {profile.location ? (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              ) : null}

              {profile.linkedin ? (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    Perfil LinkedIn
                  </a>
                </div>
              ) : null}

              {profile.github ? (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    Perfil GitHub
                  </a>
                </div>
              ) : null}

              {!profile.email && !profile.phone && !profile.location && !profile.linkedin && !profile.github && (
                <p className="text-slate-400 italic">Nenhum contacto configurado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
