import React from 'react';
import { Star, Plus, Edit2, Trash2, ExternalLink, Users, User, BookOpen } from 'lucide-react';
import { PortfolioData, FeaturedProject } from '../types';
import { themePalettes } from '../utils/theme';

interface SectionFeaturedProjectsProps {
  data: PortfolioData;
  isEditMode: boolean;
  onAddProject: () => void;
  onEditProject: (project: FeaturedProject) => void;
  onDeleteProject: (projectId: string) => void;
}

export const SectionFeaturedProjects: React.FC<SectionFeaturedProjectsProps> = ({
  data,
  isEditMode,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;

  return (
    <section id="projetos" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${palette.primaryLightBg} ${palette.primaryText}`}>
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">6. Trabalhos e projetos em destaque</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Seleção dos trabalhos mais relevantes realizados ao longo da formação
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={onAddProject}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${palette.primaryBg} ${palette.primaryHover} text-white shadow transition flex items-center gap-1.5`}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Projeto</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {data.featuredProjects && data.featuredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.featuredProjects.map((project) => {
            const associatedUfcd = data.ufcds.find((u) => u.id === project.ufcdId);

            return (
              <div
                key={project.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image Header Preview */}
                  {project.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {project.isGroupWork ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-900/80 text-purple-200 backdrop-blur-md flex items-center gap-1 border border-purple-500/30">
                            <Users className="w-3 h-3" /> Trabalho de Grupo
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-slate-200 backdrop-blur-md flex items-center gap-1 border border-slate-700">
                            <User className="w-3 h-3" /> Trabalho Individual
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    {/* UFCD & Context Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {associatedUfcd ? `UFCD ${associatedUfcd.code} — ${associatedUfcd.name}` : project.context}
                      </span>

                      {isEditMode && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditProject(project)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Editar trabalho"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(project.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="Eliminar trabalho"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {project.title}
                    </h3>

                    {/* Description: O que fiz */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">O que fiz:</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* What I Learned */}
                    {project.whatILearned && (
                      <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> O que aprendi com este trabalho:
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                          "{project.whatILearned}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Link Button */}
                {project.linkUrl && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Ver trabalho completo</span>
                    <a
                      href={project.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-semibold ${palette.primaryText} hover:underline flex items-center gap-1`}
                    >
                      <span>Aceder à Ligação</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
            Nenhum trabalho em destaque adicionado ainda.
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Destaque os trabalhos mais representativos elaborados durante as 8 UFCD.
          </p>
          {isEditMode && (
            <button
              onClick={onAddProject}
              className={`mt-2 px-4 py-2 rounded-xl text-xs font-semibold ${palette.primaryBg} text-white inline-flex items-center gap-1.5`}
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Primeiro Trabalho</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
