import React, { useState } from 'react';
import { 
  FolderCheck, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  MessageSquare, 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  HardDrive, 
  Users, 
  User, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  ArrowUpLeft
} from 'lucide-react';
import { PortfolioData, UFCD, EvidenceItem, EvidenceType } from '../types';
import { themePalettes } from '../utils/theme';

interface SectionUFCDPagesProps {
  data: PortfolioData;
  selectedUfcdId: string;
  onSelectUfcd: (id: string) => void;
  isEditMode: boolean;
  onEditUfcd: (ufcd: UFCD) => void;
  onAddEvidence: (ufcdId: string) => void;
  onDeleteEvidence: (ufcdId: string, evidenceId: string) => void;
}

export const SectionUFCDPages: React.FC<SectionUFCDPagesProps> = ({
  data,
  selectedUfcdId,
  onSelectUfcd,
  isEditMode,
  onEditUfcd,
  onAddEvidence,
  onDeleteEvidence,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;
  const [activeTab, setActiveTab] = useState<string>(selectedUfcdId || data.ufcds[0]?.id || '');
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  // Sync state if parent selectedUfcdId changes
  React.useEffect(() => {
    if (selectedUfcdId) {
      setActiveTab(selectedUfcdId);
    }
  }, [selectedUfcdId]);

  const currentUfcd = data.ufcds.find((u) => u.id === activeTab) || data.ufcds[0];
  const currentIndex = data.ufcds.findIndex((u) => u.id === currentUfcd?.id);

  if (!currentUfcd) return null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevId = data.ufcds[currentIndex - 1].id;
      setActiveTab(prevId);
      onSelectUfcd(prevId);
    }
  };

  const handleNext = () => {
    if (currentIndex < data.ufcds.length - 1) {
      const nextId = data.ufcds[currentIndex + 1].id;
      setActiveTab(nextId);
      onSelectUfcd(nextId);
    }
  };

  const handleBackToTimeline = () => {
    const el = document.getElementById('percurso');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const getEvidenceIcon = (type: EvidenceType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'presentation':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'google_drive':
        return <HardDrive className="w-4 h-4 text-teal-500" />;
      case 'link':
      default:
        return <LinkIcon className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <section id="ufcds" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${palette.primaryLightBg} ${palette.primaryText}`}>
            <FolderCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5. Páginas individuais das UFCD</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Estrutura padronizada de reflexão e registo de evidências por Unidade de Formação
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Voltar ao Percurso Button */}
          <button
            onClick={handleBackToTimeline}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition text-xs font-semibold flex items-center gap-1.5"
            title="Voltar à visão geral da linha temporal"
          >
            <ArrowUpLeft className="w-4 h-4 text-slate-500" />
            <span>Voltar ao meu percurso</span>
          </button>

          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold flex items-center gap-1"
              title="UFCD anterior"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">UFCD anterior</span>
            </button>

            <span className="text-xs font-semibold px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {currentIndex + 1} / {data.ufcds.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === data.ufcds.length - 1}
              className="px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold flex items-center gap-1"
              title="UFCD seguinte"
            >
              <span className="hidden sm:inline">UFCD seguinte</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs Bar for 8 UFCDs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {data.ufcds.map((ufcd) => {
          const isSelected = ufcd.id === currentUfcd.id;
          return (
            <button
              key={ufcd.id}
              onClick={() => {
                setActiveTab(ufcd.id);
                onSelectUfcd(ufcd.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isSelected
                  ? `${palette.primaryBg} text-white border-transparent shadow-md`
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="font-mono">{ufcd.code}</span>
              <span className="hidden sm:inline truncate max-w-[140px]">{ufcd.name}</span>
            </button>
          );
        })}
      </div>

      {/* Single UFCD Structured View Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden space-y-8 p-6 sm:p-8">
        
        {/* 1. Identificação da UFCD */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${palette.badgeBg}`}>
                UFCD {currentUfcd.code}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                {currentUfcd.hours} Horas
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentUfcd.name}
            </h3>

            {currentUfcd.trainer && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formador(a): <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUfcd.trainer}</span>
              </p>
            )}
          </div>

          {isEditMode && (
            <button
              onClick={() => onEditUfcd(currentUfcd)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl shadow transition flex items-center gap-2 text-xs self-start md:self-auto"
            >
              <Edit2 className="w-4 h-4" />
              <span>Editar esta UFCD</span>
            </button>
          )}
        </div>

        {/* Grid for Reflection Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 2. O que aprendi */}
          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className={`w-5 h-5 ${palette.primaryText}`} />
              O que aprendi
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {currentUfcd.whatILearned || 'Descreva sucintamente o que aprendeu nesta UFCD.'}
            </p>
          </div>

          {/* 3. Atividades realizadas */}
          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Atividades realizadas
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {currentUfcd.activitiesDone || 'Registe as principais atividades e exercícios práticos efetuados.'}
            </p>
          </div>

          {/* 5. Dificuldades sentidas */}
          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Dificuldades sentidas
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {currentUfcd.difficultiesFaced || 'Indique as principais dificuldades encontradas durante o módulo.'}
            </p>
          </div>

          {/* 6. Estratégias utilizadas para ultrapassar as dificuldades */}
          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Estratégias para ultrapassar as dificuldades
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {currentUfcd.howIOvercame || 'Explique que estratégias utilizou para superar os obstáculos.'}
            </p>
          </div>

          {/* 7. Competências desenvolvidas */}
          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Competências desenvolvidas
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {currentUfcd.skillsDeveloped || 'Enumere as competências adquiridas nesta UFCD.'}
            </p>
          </div>

          {/* 8. Reflexão sobre a UFCD */}
          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-500" />
              Reflexão sobre a UFCD
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {currentUfcd.finalReflection || 'Síntese reflexiva pessoal sobre a utilidade desta UFCD no seu percurso.'}
            </p>
          </div>
        </div>

        {/* 4. Trabalhos e evidências */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderCheck className={`w-5 h-5 ${palette.primaryText}`} />
                Trabalhos e evidências ({currentUfcd.evidences ? currentUfcd.evidences.length : 0})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fotografias, capturas de ecrã, documentos, apresentações, vídeos, trabalhos de grupo e ligações
              </p>
            </div>

            <button
              onClick={() => onAddEvidence(currentUfcd.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${palette.primaryBg} ${palette.primaryHover} text-white shadow-sm transition flex items-center gap-1.5`}
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Evidência</span>
            </button>
          </div>

          {/* Evidence Items Grid */}
          {currentUfcd.evidences && currentUfcd.evidences.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUfcd.evidences.map((evidence) => (
                <div
                  key={evidence.id}
                  className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                        {getEvidenceIcon(evidence.type)}
                        <span className="capitalize">{evidence.type.replace('_', ' ')}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        {evidence.isGroupWork ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full">
                            <Users className="w-3 h-3" /> Grupo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                            <User className="w-3 h-3" /> Individual
                          </span>
                        )}

                        {isEditMode && (
                          <button
                            onClick={() => onDeleteEvidence(currentUfcd.id, evidence.id)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="Eliminar evidência"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Preview if image */}
                    {evidence.type === 'image' && evidence.url && (
                      <div
                        onClick={() => setSelectedImageModal(evidence.url)}
                        className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer group-hover:opacity-95 transition"
                      >
                        <img src={evidence.url} alt={evidence.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>
                    )}

                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                      {evidence.title}
                    </h5>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                      {evidence.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span>{evidence.date}</span>

                    {evidence.url && (
                      <a
                        href={evidence.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>Abrir Evidência</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Nenhuma evidência associada a esta UFCD.
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Adicione fotografias, ficheiros, relatórios ou hiperligações para demonstrar os seus trabalhos práticos.
              </p>
              <button
                onClick={() => onAddEvidence(currentUfcd.id)}
                className={`mt-2 px-4 py-2 rounded-xl text-xs font-semibold ${palette.primaryBg} text-white inline-flex items-center gap-1.5`}
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Primeira Evidência</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Navigation for Previous / Next UFCD */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>UFCD Anterior</span>
          </button>

          <button
            onClick={handleBackToTimeline}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium underline"
          >
            Voltar ao meu percurso
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === data.ufcds.length - 1}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
          >
            <span>Próxima UFCD</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImageModal && (
        <div
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm p-4 flex items-center justify-center cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={selectedImageModal} alt="Evidência Ampliada" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" />
            <p className="text-center text-xs text-slate-300 mt-2">Clique em qualquer lugar para fechar</p>
          </div>
        </div>
      )}
    </section>
  );
};
