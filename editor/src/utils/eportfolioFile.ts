import { PortfolioData } from '../types';
import { normalizePortfolioData, createBlankTemplate, savePortfolioData, PortfolioTemplate } from './storage';

export interface EportfolioFileEnvelope {
  fileType: 'eportfolio-project';
  formatVersion: number;
  savedAt: string;
  data: PortfolioData;
}

export interface ValidationResult {
  valid: boolean;
  data?: PortfolioData;
  error?: string;
  isLegacy?: boolean;
  formatVersion?: number;
  notice?: string;
}

// Global variable to keep track of current FileSystemFileHandle if supported
let activeFileHandle: any = null;

/**
 * Check if the browser supports the File System Access API
 */
export function supportsFileSystemAccess(): boolean {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
}

/**
 * Gets the current active file handle name, if any
 */
export function getActiveFileName(): string | null {
  return activeFileHandle ? activeFileHandle.name : null;
}

/**
 * Resets active file handle (e.g., when starting a new project)
 */
export function resetActiveFileHandle(): void {
  activeFileHandle = null;
}

/**
 * Formats student name or course to construct default file name
 * Example: e-portfolio-maria-silva.eportfolio
 */
export function getEportfolioFileName(data: PortfolioData): string {
  const rawName = data.profile?.studentName || 'formando';
  const cleanName = rawName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `e-portfolio-${cleanName || 'formando'}.eportfolio`;
}

/**
 * Wraps portfolio data into standard .eportfolio envelope structure v1
 */
export function buildEportfolioEnvelope(data: PortfolioData): EportfolioFileEnvelope {
  return {
    fileType: 'eportfolio-project',
    formatVersion: 1,
    savedAt: new Date().toISOString(),
    data,
  };
}

/**
 * Validates file content string before parsing and importing.
 * Validates envelope structure, formatVersion, essential sections, and legacy fallback.
 */
export function validateAndParseEportfolio(jsonText: string): ValidationResult {
  if (!jsonText || typeof jsonText !== 'string' || !jsonText.trim()) {
    return {
      valid: false,
      error: 'O ficheiro de projeto está vazio ou não é um ficheiro de texto válido.',
    };
  }

  try {
    const parsed = JSON.parse(jsonText);

    if (!parsed || typeof parsed !== 'object') {
      return {
        valid: false,
        error: 'O ficheiro não contém um objeto de dados JSON válido.',
      };
    }

    // 1. Standard .eportfolio Envelope format
    if (parsed.fileType === 'eportfolio-project') {
      if (typeof parsed.formatVersion !== 'number' || parsed.formatVersion > 1) {
        return {
          valid: false,
          error: `Versão do formato do ficheiro (${parsed.formatVersion}) não é suportada por esta versão da aplicação. Por favor atualize a aplicação.`,
        };
      }

      const innerData = parsed.data;
      if (!innerData || typeof innerData !== 'object') {
        return {
          valid: false,
          error: 'O ficheiro .eportfolio não contém o bloco de dados "data" do e-portefólio.',
        };
      }

      // Check essential sections
      if (!innerData.profile || !innerData.course || !Array.isArray(innerData.ufcds)) {
        return {
          valid: false,
          error: 'O ficheiro .eportfolio está incompleto. Faltam secções essenciais (perfil, curso ou UFCDs).',
        };
      }

      delete innerData.apiKey;
      delete innerData.secret;
      delete innerData.credentials;

      const normalized = normalizePortfolioData(innerData);

      return {
        valid: true,
        data: normalized,
        isLegacy: false,
        formatVersion: parsed.formatVersion,
      };
    }

    // 2. Reject mismatched fileType explicitly
    if (parsed.fileType && parsed.fileType !== 'eportfolio-project') {
      return {
        valid: false,
        error: `Tipo de ficheiro incompatível: "${parsed.fileType}". Era esperado um ficheiro de projeto "eportfolio-project".`,
      };
    }

    // 3. Legacy JSON format fallback (old exported backup files)
    if (parsed.profile || parsed.course || Array.isArray(parsed.ufcds)) {
      delete parsed.apiKey;
      delete parsed.secret;
      delete parsed.credentials;

      const normalized = normalizePortfolioData(parsed);

      return {
        valid: true,
        data: normalized,
        isLegacy: true,
        notice: 'Ficheiro importado do formato anterior (JSON legado). Ao guardar, será automaticamente convertido para a nova estrutura oficial .eportfolio v1.',
      };
    }

    return {
      valid: false,
      error: 'O ficheiro fornecido não é um ficheiro de e-portefólio compatível (.eportfolio ou .json). Faltam as secções essenciais do e-portefólio.',
    };

  } catch (err: any) {
    console.error('Erro na validação do ficheiro .eportfolio:', err);
    return {
      valid: false,
      error: 'Ficheiro danificado ou com sintaxe JSON inválida. O conteúdo não pôde ser lido como um e-portefólio válido.',
    };
  }
}

/**
 * 1. Novo Projeto: Creates a blank template and clears file handle
 */
export function handleNewProject(currentData: PortfolioData, template: PortfolioTemplate = 'blank'): { data: PortfolioData; fileName: string } {
  resetActiveFileHandle();
  const blank = createBlankTemplate(template);
  savePortfolioData(blank);
  return {
    data: blank,
    fileName: getEportfolioFileName(blank),
  };
}

/**
 * 2. Abrir Projeto: Prompts confirmation, validates, and loads .eportfolio or .json file
 */
export async function handleOpenProject(): Promise<{ data?: PortfolioData; fileName?: string; success: boolean; error?: string; notice?: string }> {
  // Confirm before replacing active project
  if (!window.confirm('Atenção: Ao abrir um novo projeto, o e-portefólio atualmente aberto no navegador será substituído.\n\nRecomenda-se guardar o seu projeto atual antes de continuar.\n\nDeseja continuar e selecionar o ficheiro do seu computador?')) {
    return { success: false, error: 'Operação cancelada pelo utilizador.' };
  }

  // If File System Access API is supported
  if (supportsFileSystemAccess()) {
    try {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Ficheiro de Projeto E-Portefólio (*.eportfolio, *.json)',
            accept: {
              'application/json': ['.eportfolio', '.json'],
            },
          },
        ],
        multiple: false,
      });

      if (!handle) return { success: false, error: 'Nenhum ficheiro selecionado.' };

      const file = await handle.getFile();
      const content = await file.text();
      const validation = validateAndParseEportfolio(content);

      if (!validation.valid || !validation.data) {
        return {
          success: false,
          error: validation.error || 'Ficheiro inválido ou danificado.',
        };
      }

      activeFileHandle = handle;
      savePortfolioData(validation.data);

      return {
        success: true,
        data: validation.data,
        fileName: file.name,
        notice: validation.notice,
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'Operação cancelada pelo utilizador.' };
      }
      console.warn('Fallback para input de ficheiro clássico devido a:', err);
    }
  }

  // Fallback using standard input element
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.eportfolio,.json';

    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) {
        resolve({ success: false, error: 'Nenhum ficheiro selecionado.' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        const validation = validateAndParseEportfolio(content);

        if (!validation.valid || !validation.data) {
          resolve({
            success: false,
            error: validation.error || 'Ficheiro inválido ou danificado.',
          });
          return;
        }

        activeFileHandle = null;
        savePortfolioData(validation.data);

        resolve({
          success: true,
          data: validation.data,
          fileName: file.name,
          notice: validation.notice,
        });
      };

      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Erro ao ler o ficheiro no computador.',
        });
      };

      reader.readAsText(file);
    };

    input.click();
  });
}

/**
 * 3. Guardar Projeto: Saves directly to activeFileHandle if exists, or triggers Save As / Download
 */
export async function handleSaveProject(data: PortfolioData): Promise<{ success: boolean; fileName: string; method: 'direct' | 'download' | 'picker' }> {
  // Always update localStorage first
  savePortfolioData(data);

  // If we have an active file handle and browser supports File System Access API
  if (activeFileHandle && supportsFileSystemAccess()) {
    try {
      const envelope = buildEportfolioEnvelope(data);
      const writable = await activeFileHandle.createWritable();
      await writable.write(JSON.stringify(envelope, null, 2));
      await writable.close();

      return {
        success: true,
        fileName: activeFileHandle.name,
        method: 'direct',
      };
    } catch (err) {
      console.warn('Erro ao guardar diretamente no ficheiro existente, tentando Save As:', err);
    }
  }

  // If no handle or direct write failed, perform Save As
  return handleSaveProjectAs(data);
}

/**
 * 4. Guardar Projeto Como: Always prompts for a new file location/name
 */
export async function handleSaveProjectAs(data: PortfolioData): Promise<{ success: boolean; fileName: string; method: 'picker' | 'download' }> {
  savePortfolioData(data);
  const defaultName = getEportfolioFileName(data);
  const envelope = buildEportfolioEnvelope(data);

  if (supportsFileSystemAccess()) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: defaultName,
        types: [
          {
            description: 'Ficheiro de Projeto E-Portefólio',
            accept: {
              'application/json': ['.eportfolio'],
            },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(envelope, null, 2));
      await writable.close();

      activeFileHandle = handle;

      return {
        success: true,
        fileName: handle.name,
        method: 'picker',
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, fileName: defaultName, method: 'picker' };
      }
      console.warn('Fallback para descarregamento tradicional:', err);
    }
  }

  // Fallback download
  downloadEportfolioFile(data, defaultName);
  return {
    success: true,
    fileName: defaultName,
    method: 'download',
  };
}

/**
 * 5. Criar Cópia de Segurança: Instant timestamped backup download
 */
export function handleCreateBackup(data: PortfolioData): string {
  savePortfolioData(data);
  const dateStr = new Date().toISOString().slice(0, 10);
  const studentClean = (data.profile?.studentName || 'formando')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-');

  const backupName = `e-portfolio-${studentClean}-copia-seguranca-${dateStr}.eportfolio`;
  downloadEportfolioFile(data, backupName);
  return backupName;
}

/**
 * Helper to trigger standard download of .eportfolio file wrapped in envelope
 */
export function downloadEportfolioFile(data: PortfolioData, fileName: string): void {
  const envelope = buildEportfolioEnvelope(data);
  const jsonStr = JSON.stringify(envelope, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
