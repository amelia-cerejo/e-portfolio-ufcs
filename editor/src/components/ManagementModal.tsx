import React, { useState } from 'react';
import {
  X,
  FilePlus,
  Eye,
  Archive,
  Printer,
  FileText,
  Palette,
  Settings,
  Clock,
  FolderOpen,
  Save,
  HardDrive,
  ShieldCheck,
  FileCode,
  Filter
} from 'lucide-react';
import { PortfolioData } from '../types';
import { resetToDefaultData } from '../utils/storage';
import { generatePortfolioZip } from '../utils/exportZip';
import { PublicExportOptions } from '../utils/generateStandaloneHtml';
import {
  handleNewProject,
  handleOpenProject,
  handleSaveProject,
  handleSaveProjectAs,
  handleCreateBackup,
  getActiveFileName,
  resetActiveFileHandle
} from '../utils/eportfolioFile';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onDataLoaded: (newData: PortfolioData) => void;
  onOpenThemeModal: () => void;
  onEnterPublicPreview: () => void;
  lastSavedTime: string | null;
}

export const ManagementModal: React.FC<ManagementModalProps> = ({
  isOpen,
  onClose,
  data,
  onDataLoaded,
  onOpenThemeModal,
  onEnterPublicPreview,
  lastSavedTime,
}) => {

  // Privacy options for public static exports & publishing
  const [exportOptions, setExportOptions] = useState<PublicExportOptions>({
    includeBio: true,
    includeBackground: true,
    includeDifficulties: true,
    includeReflections: true,
    includeTrainerName: true,
  });

  if (!isOpen) return null;

  const currentFileName = getActiveFileName();

  // 1. Novo projeto
  const onNewProjectClick = () => {
    if (window.confirm('Aviso: Esta ação irá criar um Novo Projeto em branco (.eportfolio). Os dados não guardados serão substituídos. Certifique-se de que guardou o seu projeto. Pretende continuar?')) {
      const res = handleNewProject(data);
      onDataLoaded(res.data);
      alert('Novo projeto em branco criado com sucesso! Pode agora iniciar o seu trabalho.');
      onClose();
    }
  };

  const onLoadExampleClick = () => {
    if (window.confirm('Carregar o exemplo da ação 26109? O projeto atual neste navegador será substituído. Guarde primeiro uma cópia .eportfolio se o quiser conservar.')) {
      resetActiveFileHandle();
      onDataLoaded(resetToDefaultData());
      onClose();
    }
  };

  // 2. Abrir projeto (.eportfolio)
  const onOpenProjectClick = async () => {
    const res = await handleOpenProject();
    if (res.success && res.data) {
      onDataLoaded(res.data);
      if (res.notice) {
        alert(`Projeto "${res.fileName}" aberto com sucesso!\n\nNota: ${res.notice}`);
      } else {
        alert(`Projeto "${res.fileName}" aberto e validado com sucesso!`);
      }
      onClose();
    } else if (res.error && res.error !== 'Operação cancelada pelo utilizador.') {
      alert(`Erro ao abrir projeto:\n\n${res.error}`);
    }
  };

  // 3. Guardar projeto (.eportfolio)
  const onSaveProjectClick = async () => {
    const res = await handleSaveProject(data);
    if (res.success) {
      if (res.method === 'direct') {
        alert(`Projeto guardado com sucesso no ficheiro "${res.fileName}"!`);
      } else {
        alert(`Projeto guardado como "${res.fileName}".`);
      }
    }
  };

  // 4. Guardar projeto como...
  const onSaveProjectAsClick = async () => {
    const res = await handleSaveProjectAs(data);
    if (res.success) {
      alert(`Projeto guardado com o nome "${res.fileName}".`);
    }
  };

  // 5. Criar cópia de segurança
  const onCreateBackupClick = () => {
    const backupName = handleCreateBackup(data);
    alert(`Cópia de segurança criada e descarregada com sucesso:\n${backupName}`);
  };

  // Pré-visualizar página pública
  const handlePreviewPublic = () => {
    onClose();
    onEnterPublicPreview();
  };

  // Descarregar página Web (.zip)
  const handleDownloadZip = async () => {
    try {
      await generatePortfolioZip(data, exportOptions);
    } catch (err) {
      console.error('Erro ao gerar ficheiro ZIP:', err);
      alert('Ocorreu um erro ao gerar o ficheiro ZIP estático.');
    }
  };

  // Imprimir
  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Exportar para PDF
  const handleExportPDF = () => {
    onClose();
    setTimeout(() => {
      alert('Para guardar como PDF: na janela de impressão do seu navegador, escolha "Guardar como PDF" no campo Destino.');
      window.print();
    }, 200);
  };

  // Personalizar apresentação
  const handleThemeCustomizer = () => {
    onClose();
    onOpenThemeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="management-modal bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Gestão e Opções do E-Portefólio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guardar no computador e preparar uma cópia para partilhar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Automatic Storage Status & Incognito Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
            <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 font-bold">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Gravação automática neste navegador</span>
              </div>
              <span className="text-[11px] bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-mono">
                {lastSavedTime ? `Última gravação: ${lastSavedTime}` : 'Guardado'}
              </span>
            </div>
            <p className="text-amber-950/80 dark:text-amber-200/90 text-[11px] leading-relaxed">
              As alterações ficam apenas neste navegador, neste dispositivo. Quem abre a aplicação noutro computador ou navegador não consegue ver os seus dados. Para conservar o trabalho, use <strong>Guardar projeto</strong> e guarde o ficheiro .eportfolio no computador. Em navegação privada, ou se limpar os dados do navegador, a gravação automática pode desaparecer.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Escolher ponto de partida</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onNewProjectClick}
                className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition text-left flex items-start gap-3"
              >
                <FilePlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span><strong className="block text-sm text-slate-900 dark:text-white">Portefólio em branco</strong><small className="block text-slate-600 dark:text-slate-300 mt-1">Começar com uma UFCD e acrescentar outras.</small></span>
              </button>
              <button
                type="button"
                onClick={onLoadExampleClick}
                className="p-3.5 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/30 hover:bg-violet-100 dark:hover:bg-violet-950/50 transition text-left flex items-start gap-3"
              >
                <Eye className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                <span><strong className="block text-sm text-slate-900 dark:text-white">Exemplo da ação 26109</strong><small className="block text-slate-600 dark:text-slate-300 mt-1">Carregar o modelo preenchido com oito UFCD.</small></span>
              </button>
            </div>
          </div>

          {/* Group 1: Ficheiro de Projeto Editável (.eportfolio) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-500" />
                <span>1. Ficheiro de Projeto Editável (.eportfolio)</span>
              </h4>
              {currentFileName && (
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Aberto: {currentFileName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Abrir projeto */}
              <button
                type="button"
                onClick={onOpenProjectClick}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-200 dark:hover:border-blue-800/50 transition text-left flex items-start gap-3 group"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-105 transition">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Abrir projeto
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Carregar ficheiro .eportfolio do computador
                  </div>
                </div>
              </button>

              {/* Guardar projeto */}
              <button
                type="button"
                onClick={onSaveProjectClick}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition text-left flex items-start gap-3 group"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition">
                  <Save className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Guardar projeto
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Guardar o ficheiro .eportfolio no computador
                  </div>
                </div>
              </button>

              {/* Guardar projeto como */}
              <button
                type="button"
                onClick={onSaveProjectAsClick}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-200 dark:hover:border-purple-800/50 transition text-left flex items-start gap-3 group"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-105 transition">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Guardar projeto como...
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Escolher outro nome ou localização (.eportfolio)
                  </div>
                </div>
              </button>

              {/* Criar cópia de segurança */}
              <button
                type="button"
                onClick={onCreateBackupClick}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:border-teal-200 dark:hover:border-teal-800/50 transition text-left flex items-start gap-3 group sm:col-span-2"
              >
                <div className="p-2 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl group-hover:scale-105 transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Criar cópia de segurança
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Descarregar imediatamente uma cópia de salvaguarda com data e hora atual
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Group 2: Seleção de Conteúdos Públicos e Privacidade */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-500" />
              <span>2. Conteúdo da cópia para partilhar</span>
            </h4>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Estas opções definem o que aparece no ZIP exportado. Não alteram o projeto guardado e não enviam dados para a Internet. Reveja a cópia antes de a enviar a alguém.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeBio}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeBio: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Apresentação Pessoal / Biografia</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeBackground}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeBackground: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Percurso e Experiência Anterior</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeDifficulties}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeDifficulties: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Dificuldades Sentidas e Estratégias</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeReflections}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeReflections: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Reflexões Pessoais e Finais</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeTrainerName}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeTrainerName: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Nome do(a) Formador(a) nas UFCDs</span>
                </label>
              </div>
            </div>
          </div>

          {/* Group 3: Local share copy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              3. Preparar uma cópia para partilhar
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Pré-visualizar página pública */}
              <button
                type="button"
                onClick={handlePreviewPublic}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:border-teal-200 dark:hover:border-teal-800/50 transition text-left flex items-start gap-3 group"
              >
                <div className="p-2 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl group-hover:scale-105 transition">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Pré-visualizar portefólio
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Ver o aspeto do portefólio antes de exportar
                  </div>
                </div>
              </button>

              {/* Descarregar página Web (.zip) */}
              <button
                type="button"
                onClick={handleDownloadZip}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-200 dark:hover:border-blue-800/50 transition text-left flex items-start gap-3 group"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-105 transition">
                  <Archive className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Descarregar cópia para partilhar (.zip)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Ficheiro local com página de leitura. Só será partilhado se o enviar.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Group 4: Impressão e Estilo */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              4. Impressão, PDF e Aparência
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Imprimir */}
              <button
                type="button"
                onClick={handlePrint}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left flex items-start gap-3 group"
              >
                <div className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl group-hover:scale-105 transition">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Imprimir
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Versão em papel
                  </div>
                </div>
              </button>

              {/* Exportar para PDF */}
              <button
                type="button"
                onClick={handleExportPDF}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-800/50 transition text-left flex items-start gap-3 group"
              >
                <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl group-hover:scale-105 transition">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Exportar para PDF
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Guardar em PDF
                  </div>
                </div>
              </button>

              {/* Personalizar apresentação */}
              <button
                type="button"
                onClick={handleThemeCustomizer}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-pink-50 dark:hover:bg-pink-950/30 hover:border-pink-200 dark:hover:border-pink-800/50 transition text-left flex items-start gap-3 group"
              >
                <div className="p-2 bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 rounded-xl group-hover:scale-105 transition">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Personalizar
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Cores e logótipo
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
