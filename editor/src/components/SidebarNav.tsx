import React, { useState } from 'react';
import {
  Home,
  User,
  GitCommit,
  FolderKanban,
  BrainCircuit,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  Heart,
  X,
  Menu,
  Sparkles
} from 'lucide-react';
import { PortfolioData, UFCD } from '../types';
import { themePalettes } from '../utils/theme';

interface SidebarNavProps {
  data: PortfolioData;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  selectedUfcdId: string;
  onSelectUfcd: (id: string) => void;
  onOpenManagementModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  data,
  activeSection,
  setActiveSection,
  selectedUfcdId,
  onSelectUfcd,
  onOpenManagementModal,
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;

  // Accordion open states
  const [percursoExpanded, setPercursoExpanded] = useState<boolean>(true);
  const [reflexaoExpanded, setReflexaoExpanded] = useState<boolean>(true);
  const [ufcdsExpanded, setUfcdsExpanded] = useState<boolean>(false);

  const scrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUfcdClick = (ufcdId: string) => {
    onSelectUfcd(ufcdId);
    scrollTo('ufcds');
  };

  // Nav Item Component
  const NavButton = ({
    id,
    label,
    icon: Icon,
    isSub = false,
  }: {
    id: string;
    label: string;
    icon: React.ElementType;
    isSub?: boolean;
  }) => {
    const isActive = activeSection === id;

    return (
      <button
        onClick={() => scrollTo(id)}
        title={isCollapsed ? label : undefined}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative group ${
          isSub ? 'pl-8 text-slate-600 dark:text-slate-400' : ''
        } ${
          isActive
            ? `${palette.primaryLightBg} ${palette.primaryText} font-bold`
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        {/* Active Indicator Bar */}
        {isActive && (
          <span className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full ${palette.primaryBg}`} />
        )}

        <Icon className={`w-4 h-4 shrink-0 ${isActive ? palette.primaryText : 'text-slate-500 dark:text-slate-400'}`} />

        {!isCollapsed && <span className="truncate">{label}</span>}

        {/* Collapsed Tooltip */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            {label}
          </div>
        )}
      </button>
    );
  };

  const menuContent = (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 py-4 px-3 space-y-6">
      
      {/* Brand Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo('capa')}>
          {data.theme.entityLogoUrl ? (
            <img
              src={data.theme.entityLogoUrl}
              alt="Logótipo"
              className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
          ) : (
            <div className={`w-8 h-8 rounded-lg ${palette.primaryBg} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm`}>
              EP
            </div>
          )}
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                E-Portefólio
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {data.profile.studentName || 'Formando'}
              </p>
            </div>
          )}
        </div>

        {/* Close Button on Mobile */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="h-px bg-slate-200 dark:border-slate-800 dark:bg-slate-800/80 my-1" />

      {/* Navigation Group */}
      <nav className="space-y-1.5 flex-1">
        
        {/* 1. Início */}
        <NavButton id="capa" label="Início" icon={Home} />

        {/* 2. Sobre mim */}
        <NavButton id="sobre" label="Sobre mim" icon={User} />

        {/* 3. Percurso */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (isCollapsed) setIsCollapsed(false);
                setPercursoExpanded(!percursoExpanded);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                ['percurso', 'formacao', 'ufcds'].includes(activeSection)
                  ? `${palette.primaryLightBg} ${palette.primaryText} font-bold`
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GitCommit className={`w-4 h-4 shrink-0 ${palette.primaryText}`} />
                {!isCollapsed && <span className="truncate">Percurso</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${percursoExpanded ? 'rotate-180' : ''}`} />
              )}
            </button>
          </div>

          {/* Sub-items for Percurso */}
          {(!isCollapsed && percursoExpanded) && (
            <div className="pl-3 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-5 my-1">
              <button
                onClick={() => scrollTo('formacao')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeSection === 'formacao'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                A minha formação
              </button>

              <button
                onClick={() => scrollTo('percurso')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeSection === 'percurso'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                O meu percurso
              </button>
            </div>
          )}
        </div>

        {/* 4. Trabalhos */}
        <NavButton id="trabalhos" label="Trabalhos" icon={FolderKanban} />

        {/* 5. Reflexão */}
        <div className="space-y-1">
          <button
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              setReflexaoExpanded(!reflexaoExpanded);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              ['evolucao', 'reflexao-final', 'encerramento'].includes(activeSection)
                ? `${palette.primaryLightBg} ${palette.primaryText} font-bold`
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BrainCircuit className={`w-4 h-4 shrink-0 ${palette.primaryText}`} />
              {!isCollapsed && <span className="truncate">Reflexão</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${reflexaoExpanded ? 'rotate-180' : ''}`} />
            )}
          </button>

          {(!isCollapsed && reflexaoExpanded) && (
            <div className="pl-3 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-5 my-1">
              <button
                onClick={() => scrollTo('evolucao')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeSection === 'evolucao'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Evolução das competências
              </button>

              <button
                onClick={() => scrollTo('reflexao-final')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeSection === 'reflexao-final'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Reflexão final
              </button>

              <button
                onClick={() => scrollTo('encerramento')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeSection === 'encerramento'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Encerramento
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

      {/* 6. Gestão e opções Button */}
      <div>
        <button
          onClick={() => {
            setIsMobileOpen(false);
            onOpenManagementModal();
          }}
          title={isCollapsed ? "Gestão e opções" : undefined}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition group border border-slate-200 dark:border-slate-700/60 shadow-sm"
        >
          <Settings className="w-4 h-4 text-indigo-500 shrink-0 group-hover:rotate-45 transition-transform" />
          {!isCollapsed && <span className="truncate">Gestão e opções</span>}
        </button>
      </div>

      {/* Collapse Desktop Toggle */}
      <div className="hidden lg:flex items-center justify-end pt-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          isCollapsed ? 'w-[68px]' : 'w-[230px]'
        }`}
      >
        {menuContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
        />
      )}

      {/* Mobile Drawer (Slide In) */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {menuContent}
      </aside>
    </>
  );
};
