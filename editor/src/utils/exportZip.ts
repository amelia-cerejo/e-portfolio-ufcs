import JSZip from 'jszip';
import { PortfolioData } from '../types';
import { generateStandaloneHtml, PublicExportOptions } from './generateStandaloneHtml';

export async function generatePortfolioZip(data: PortfolioData, options: PublicExportOptions = {}): Promise<void> {
  const zip = new JSZip();

  // 1. Generate standalone index.html with privacy settings and offline fallback CSS
  const htmlContent = generateStandaloneHtml(data, options);
  zip.file('index.html', htmlContent);

  // Note: We deliberately do NOT include the raw project JSON (dados-eportefolio.json) in the public web ZIP
  // to protect private content and prevent exposing raw editable state in public zip bundles.

  // 2. Add README
  const studentName = data.profile?.studentName || 'Formando';
  const actionNum = data.course?.actionNumber || '';
  const actionTitle = data.course?.actionTitle || '';
  const entity = data.course?.entityName || '';

  const readmeContent = `E-PORTEFÓLIO DE FORMAÇÃO PROFISSIONAL (CÓPIA LOCAL PARA LEITURA)
Formando: ${studentName}
${actionNum ? `Ação nº ${actionNum}${actionTitle ? ` - ${actionTitle}` : ''}` : actionTitle ? `Formação: ${actionTitle}` : 'Formação: por preencher'}
${entity ? `Entidade Formadora: ${entity}` : ''}

CONTEÚDO DESTE FICHEIRO ZIP:
1. index.html — Versão estática e autónoma do e-portefólio (pode ser aberta em qualquer computador sem internet).

COMO UTILIZAR:
- Dê duplo clique no ficheiro "index.html" para abrir a sua página estática de e-portefólio no seu navegador de internet (Chrome, Safari, Edge, Firefox, etc.).
- Este ZIP é guardado no seu computador. Exportar não publica o portefólio na Internet.
- Se quiser partilhar o trabalho, envie apenas esta cópia às pessoas escolhidas, depois de rever os dados que contém.
- O ficheiro editável .eportfolio deve ficar consigo e não está incluído neste ZIP.
`;
  zip.file('LEIA-ME.txt', readmeContent);

  // 3. Generate Blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  const studentClean = (data.profile?.studentName || 'formando')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');
  downloadLink.download = `e_portefolio_estatico_${studentClean}.zip`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadLink.href);
}
