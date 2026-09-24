import { PortfolioData, UFCD, FeaturedProject } from '../types';
import { defaultPortfolioData } from '../data/defaultData';
import { normalizeSections, sectionOrder } from './sections';

const STORAGE_KEY = 'eportfolio_master_data_v1';

/** Keeps imported projects compatible without replacing their course or UFCDs. */
export function normalizePortfolioData(data: PortfolioData): PortfolioData {
  if (!data) return defaultPortfolioData;
  const defaults = data.templateId === defaultPortfolioData.templateId
    ? defaultPortfolioData
    : buildBlankTemplate();

  const normalizedCourse = {
    ...defaults.course,
    ...(data.course || {}),
  };

  const normalizedUfcds: UFCD[] = Array.isArray(data.ufcds)
    ? data.ufcds.map((ufcd) => ({
        ...ufcd,
        evidences: Array.isArray(ufcd.evidences) ? ufcd.evidences : [],
      }))
    : defaults.ufcds;

  // Clean featured projects (remove result and skillsShown)
  const normalizedProjects: FeaturedProject[] = Array.isArray(data.featuredProjects)
    ? data.featuredProjects.map((p) => {
        const cleanProj: FeaturedProject = {
          id: p.id || `proj_${Math.random()}`,
          title: p.title || 'Trabalho',
          context: p.context || '',
          ufcdId: p.ufcdId || normalizedUfcds[0]?.id || '',
          description: p.description || '',
          whatILearned: p.whatILearned || '',
          isGroupWork: Boolean(p.isGroupWork),
          imageUrl: p.imageUrl || '',
          linkUrl: p.linkUrl || '',
        };
        return cleanProj;
      })
    : defaults.featuredProjects;

  return {
    version: data.version || defaults.version,
    templateId: data.templateId || defaults.templateId,
    sections: normalizeSections(data.sections),
    theme: {
      ...defaults.theme,
      ...(data.theme || {}),
    },
    course: normalizedCourse,
    profile: {
      ...defaults.profile,
      ...(data.profile || {}),
    },
    ufcds: normalizedUfcds,
    featuredProjects: normalizedProjects,
    skillEvolutions: Array.isArray(data.skillEvolutions)
      ? data.skillEvolutions
      : defaults.skillEvolutions,
    finalReflection: {
      ...defaults.finalReflection,
      ...(data.finalReflection || {}),
    },
    closure: {
      ...defaults.closure,
      ...(data.closure || {}),
    },
  };
}

export function loadPortfolioData(): PortfolioData {
  try {
    // Load only data saved in this browser on this device.
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return normalizePortfolioData(parsed);
    }
  } catch (err) {
    console.error('Error loading portfolio data:', err);
  }

  // Fallback to the sample when there is no local project.
  return defaultPortfolioData;
}

export function savePortfolioData(data: PortfolioData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving portfolio data:', err);
  }
}

export function exportPortfolioData(data: PortfolioData): void {
  exportPortfolioJson(data);
}

export function importPortfolioData(jsonString: string): PortfolioData | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed === 'object') {
      const normalized = normalizePortfolioData(parsed);
      savePortfolioData(normalized);
      return normalized;
    }
  } catch (err) {
    console.error('Error importing portfolio data:', err);
  }
  return null;
}

export function exportPortfolioJson(data: PortfolioData): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  const studentClean = (data.profile.studentName || 'formando').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const actionClean = (data.course.actionNumber || 'sem_acao').toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `e_portefolio_${actionClean}_${studentClean}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function resetToDefaultData(): PortfolioData {
  savePortfolioData(defaultPortfolioData);
  return defaultPortfolioData;
}

export type PortfolioTemplate = 'blank' | 'training' | 'professional' | 'projects';

function buildBlankTemplate(template: PortfolioTemplate = 'blank'): PortfolioData {
  const visibleByTemplate: Record<PortfolioTemplate, string[]> = {
    blank: ['capa', 'sobre', 'trabalhos'],
    training: sectionOrder,
    professional: ['capa', 'sobre', 'trabalhos', 'evolucao', 'reflexao-final', 'encerramento'],
    projects: ['capa', 'sobre', 'trabalhos', 'reflexao-final', 'encerramento'],
  };
  const blankData: PortfolioData = {
    ...defaultPortfolioData,
    templateId: `eportfolio_${template}`,
    sections: sectionOrder.map((id) => ({ id, visible: visibleByTemplate[template].includes(id) })),
    theme: {
      ...defaultPortfolioData.theme,
      entityLogoUrl: '',
      customBannerUrl: '',
    },
    course: {
      actionNumber: '',
      actionTitle: '',
      program: '',
      entityName: '',
      modality: '',
      trainingArea: '',
      duration: '',
      startDate: '',
      endDate: '',
      location: '',
      trainerName: '',
      framing: '',
      generalObjectives: [],
      specificObjectives: [],
    },
    profile: {
      ...defaultPortfolioData.profile,
      studentName: template === 'training' ? 'Nome do Formando' : 'O meu nome',
      studentPhoto: '',
      presentationPhrase: '',
      bio: '',
      background: '',
      skills: [],
      interests: [],
      courseObjectives: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
    },
    ufcds: template === 'training' ? [{
      id: 'ufcd_inicial',
      code: '',
      name: 'A minha UFCD',
      hours: 0,
      status: 'in_progress',
      trainer: '',
      whatILearned: '',
      activitiesDone: '',
      difficultiesFaced: '',
      howIOvercame: '',
      skillsDeveloped: '',
      finalReflection: '',
      evidences: [],
    }] : [],
    featuredProjects: [],
    skillEvolutions: [],
    finalReflection: {
      overallReflection: '',
      qWhatILearned: '',
      qMostEvolvedArea: '',
      qMostImportantActivity: '',
      qOvercomeDifficulties: '',
      qHowToApply: '',
      qFutureLearning: '',
    },
    closure: { finalMessage: '', acknowledgements: '' },
  };
  return blankData;
}

export function createBlankTemplate(template: PortfolioTemplate = 'blank'): PortfolioData {
  const blankData = buildBlankTemplate(template);
  savePortfolioData(blankData);
  return blankData;
}
