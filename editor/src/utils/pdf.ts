import { PdfOptions, PortfolioData } from '../types';
import { normalizeSections, visibleSections } from './sections';
import { generateConfigurableHtml } from './generateConfigurableHtml';

export function normalizePdfOptions(data: PortfolioData, saved = data.pdfOptions): PdfOptions {
  const visible = visibleSections(data);
  const validSections = normalizeSections(data.sections).map(section => section.id);
  return {
    sections: Array.isArray(saved?.sections) ? saved.sections.filter(id => validSections.includes(id)) : visible,
    ufcdIds: Array.isArray(saved?.ufcdIds) ? saved.ufcdIds.filter(id => data.ufcds.some(item => item.id === id)) : data.ufcds.map(item => item.id),
    projectIds: Array.isArray(saved?.projectIds) ? saved.projectIds.filter(id => data.featuredProjects.some(item => item.id === id)) : data.featuredProjects.map(item => item.id),
    pageBreaks: Array.isArray(saved?.pageBreaks) ? saved.pageBreaks.filter(id => validSections.includes(id)) : visible.filter(id => id !== 'capa'),
    orientation: saved?.orientation === 'landscape' ? 'landscape' : 'portrait',
    fontSize: saved && [10, 11, 12, 14].includes(saved.fontSize) ? saved.fontSize : 11,
    margin: saved && [10, 15, 20].includes(saved.margin) ? saved.margin : 15,
    eachUfcdNewPage: saved?.eachUfcdNewPage ?? true,
    includeImages: saved?.includeImages ?? true,
    includeReflections: saved?.includeReflections ?? true,
    includeDifficulties: saved?.includeDifficulties ?? true,
  };
}

export function generatePdfHtml(data: PortfolioData, input: PdfOptions): string {
  const options = normalizePdfOptions(data, input);
  const filtered: PortfolioData = {
    ...data,
    sections: (data.sections || visibleSections(data).map(id => ({ id, visible: true }))).map(section => ({ ...section, visible: options.sections.includes(section.id) })),
    ufcds: data.ufcds.filter(item => options.ufcdIds.includes(item.id)),
    featuredProjects: data.featuredProjects.filter(item => options.projectIds.includes(item.id)),
  };
  const html = generateConfigurableHtml(filtered, {
    includeImages: options.includeImages,
    includeReflections: options.includeReflections,
    includeDifficulties: options.includeDifficulties,
  }, validPdfSections(data, options));
  const width = options.orientation === 'portrait' ? 210 : 297;
  const breaks = options.pageBreaks.filter(id => options.sections.includes(id)).map(id => `[data-section="${id}"]`).join(',');
  const css = `<style>
    @page { size: A4 ${options.orientation}; margin: ${options.margin}mm; }
    body { font-size: ${options.fontSize}pt; color: #17202c; background: #e8ebef; }
    main { box-sizing: border-box; width: ${width - 2 * options.margin}mm; max-width: 100%; padding: 0; margin: 20px auto; background: white; }
    section { border: 0; border-radius: 0; padding: 8mm 0; margin: 0; }
    h1 { font-size: 2.2em; } h2 { font-size: 1.5em; } h3 { font-size: 1.15em; }
    h1,h2,h3 { break-after: avoid; } p { orphans: 3; widows: 3; }
    li, img { break-inside: avoid; } article { break-inside: auto; }
    a { overflow-wrap: anywhere; } img { max-width: 100%; max-height: 100mm; object-fit: contain; }
    .cover-text { padding: 8mm 0; } .banner { height: auto; max-height: 70mm; }
    ${breaks ? `${breaks} { border-top: 2px dashed #b8c0cb; margin-top: 12mm; }` : ''}
    .portfolio-section:first-child { border-top: 0; margin-top: 0; }
    ${options.eachUfcdNewPage ? '[data-section="ufcds"] section + section { border-top: 2px dashed #b8c0cb; margin-top: 12mm; }' : ''}
    @media print {
      body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      main { width: auto; max-width: none; margin: 0; }
      .portfolio-section { border: 0; margin: 0; }
      section { padding: 0 0 6mm; } .cover-text { padding: 6mm 0; }
      ${breaks ? `${breaks} { break-before: page; border: 0; margin: 0; }` : ''}
      .portfolio-section:first-child { break-before: auto; }
      ${options.eachUfcdNewPage ? '[data-section="ufcds"] section + section { break-before: page; border: 0; margin: 0; }' : ''}
    }
  </style>`;
  return html.replace('</head>', `${css}</head>`);
}

function validPdfSections(data: PortfolioData, options: PdfOptions) {
  return normalizeSections(data.sections).map(section => section.id).filter(id => options.sections.includes(id));
}
