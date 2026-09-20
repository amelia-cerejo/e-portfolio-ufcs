import React from 'react';
import {
  Menu,
  Eye,
  Edit3,
  CheckCircle2,
  Settings,
  Sparkles,
  Save
} from 'lucide-react';
import { PortfolioData } from '../types';
import { themePalettes } from '../utils/theme';

interface TopCompactBarProps {
  data: PortfolioData;
  activeSection: string;
  selectedUfcdId: string;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  onOpenMobileMenu: () => void;
  onOpenManagementModal: () => void;
  hasUnsavedChanges?: boolean;
  onSave?: () => void;
  lastSavedTime?: string | null;
}

export const TopCompactBar: React.FC<TopCompactBarProps> = ({
  data,
  activeSection,
  selectedUfcdId,
  isEditMode,
  setIsEditMode,
  onOpenMobileMenu,
  onOpenManagementModal,
  hasUnsavedChanges = false,
  onSave,
  lastSavedTime,
}) => {
  const palette = themePalettes[data.theme.themeColor] || themePalettes.indigo;

  // Get current section label
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'capa':
        return 'Início';
      case 'sobre':
        return 'Sobre mim';
      case 'formacao':
        return 'A minha formação';
      case 'percurso':
        return 'O meu percurso';
      case 'ufcds': {
        const ufcd = data.ufcds.find((u) => u.id === selectedUfcdId) || data.ufcds[0];
        return ufcd ? `UFCD ${ufcd.code} — ${ufcd.name}` : 'Página da UFCD';
      }
      case 'trabalhos':
        return 'Trabalhos & Evidências';
      case 'evolucao':
        return 'Evolução das competências';
      case 'reflexao-final':
        return 'Reflexão final';
      case 'certificacao':
        return 'Certificação';
      case 'encerramento':
        return 'Encerramento';
      default:
        return 'E-Portefólio';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 h-13 px-4 sm:px-6 flex items-center justify-between transition-all">
      
      {/* Left Area: Mobile Menu Button & Active Section Title */}
      <div className="flex items-center gap-3 min-w-0">
        
        {/* Mobile Menu Button - Clearly labeled "Menu" */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 text-xs font-bold shrink-0 border border-slate-200 dark:border-slate-700"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-4 h-4 text-indigo-500" />
          <span>Menu</span>
        </button>

        {/* Section Identifier Badge */}
        <div className="flex items-center gap-2 truncate">
          <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
            {getSectionTitle()}
          </h2>
        </div>
      </div>

      {/* Right Area: Status, Save button, Reading/Editing Toggle & Gestão Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Save Status Badge */}
        {hasUnsavedChanges ? (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-[11px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80"
            title="Existem alterações ainda não guardadas"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="hidden xs:inline">Alterações por guardar</span>
            <span className="xs:hidden">Por guardar</span>
          </div>
        ) : (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60"
            title={lastSavedTime ? `Última gravação: ${lastSavedTime}` : 'Guardado automaticamente'}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Guardado {lastSavedTime ? `(${lastSavedTime})` : ''}</span>
          </div>
        )}

        {/* Manual Save Button - shown when there are unsaved changes */}
        {hasUnsavedChanges && onSave && (
          <button
            onClick={onSave}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm animate-pulse hover:animate-none"
            title="Guardar alterações manualmente no armazenamento local"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar</span>
          </button>
        )}

        {/* View / Edit Mode Toggle Button */}
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
            isEditMode
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          title={isEditMode ? 'Mudar para Modo de Leitura' : 'Mudar para Modo de Edição'}
        >
          {isEditMode ? (
            <>
              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xs:inline">Modo Edição</span>
              <span className="xs:hidden">Edição</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xs:inline">Modo Leitura</span>
              <span className="xs:hidden">Leitura</span>
            </>
          )}
        </button>

        {/* Gestão e Opções Modal Trigger Button */}
        <button
          onClick={onOpenManagementModal}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          title="Abrir Gestão e Opções"
        >
          <Settings className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden md:inline">Gestão e opções</span>
        </button>
      </div>
    </header>
  );
};
