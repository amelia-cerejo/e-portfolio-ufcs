import { PortfolioData, PortfolioSection, PortfolioSectionId } from '../types';

export const sectionLabels: Record<PortfolioSectionId, string> = {
  capa: 'Início',
  sobre: 'Sobre mim',
  formacao: 'A minha formação',
  percurso: 'O meu percurso',
  ufcds: 'Páginas das UFCD',
  trabalhos: 'Trabalhos',
  evolucao: 'Evolução das competências',
  'reflexao-final': 'Reflexão final',
  certificacao: 'Certificação',
  encerramento: 'Encerramento',
};

export const sectionOrder = Object.keys(sectionLabels) as PortfolioSectionId[];

export function normalizeSections(sections: PortfolioSection[] | undefined): PortfolioSection[] {
  const valid = Array.isArray(sections) ? sections : [];
  const used = new Set<PortfolioSectionId>();
  const normalized: PortfolioSection[] = [];
  for (const section of valid) {
    if (section && section.id in sectionLabels && !used.has(section.id)) {
      normalized.push({ id: section.id, visible: section.id === 'capa' || section.visible !== false });
      used.add(section.id);
    }
  }
  for (const id of sectionOrder) {
    if (!used.has(id)) normalized.push({ id, visible: true });
  }
  return normalized;
}

export function visibleSections(data: PortfolioData): PortfolioSectionId[] {
  return normalizeSections(data.sections).filter((section) => section.visible).map((section) => section.id);
}
