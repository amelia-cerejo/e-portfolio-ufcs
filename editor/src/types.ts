export type ThemeColor = 'indigo' | 'emerald' | 'teal' | 'rose' | 'amber' | 'slate' | 'violet';
export type FontStyle = 'sans' | 'serif' | 'mono';
export type CoverStyle = 'classic' | 'modern' | 'minimal' | 'gradient';

export interface ThemeConfig {
  themeColor: ThemeColor;
  fontStyle: FontStyle;
  coverStyle: CoverStyle;
  entityLogoUrl?: string;
  customBannerUrl?: string;
}

export interface CourseInfo {
  actionNumber: string; // '26109'
  actionTitle: string; // 'Ferramentas de Produtividade e Colaboração'
  program?: string; // 'Jovem + Digital'
  entityName: string; // 'IEFP, I.P. — Serviço de Formação Profissional de Alverca'
  modality: string; // 'formação a distância'
  trainingArea?: string; // 'Ciências Informáticas'
  duration: string; // '275 horas'
  startDate: string; // '22/05/2026'
  endDate?: string;
  location?: string; // 'Alverca do Ribatejo'
  trainerName: string; // 'Amélia Cerejo Lopes e outros formadores'
  framing?: string; // Enquadramento da Formação
  generalObjectives: string[] | string;
  specificObjectives?: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'digital' | 'soft' | 'technical';
}

export interface PersonalProfile {
  studentName: string;
  studentPhoto: string;
  presentationPhrase: string;
  bio: string;
  background: string;
  skills: SkillItem[];
  interests: string[];
  courseObjectives: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export type EvidenceType = 'image' | 'document' | 'presentation' | 'video' | 'link' | 'google_drive' | 'group_work';

export interface EvidenceItem {
  id: string;
  ufcdId: string;
  title: string;
  type: EvidenceType;
  url: string;
  description: string;
  date: string;
  isGroupWork: boolean;
  fileSize?: string;
}

export interface UFCD {
  id: string;
  code: string;
  name: string;
  hours: number;
  status: 'completed' | 'in_progress' | 'upcoming';
  trainer: string;
  whatILearned: string;
  activitiesDone: string;
  difficultiesFaced: string;
  howIOvercame: string;
  skillsDeveloped: string;
  finalReflection: string;
  evidences: EvidenceItem[];
}

export interface FeaturedProject {
  id: string;
  title: string;
  context: string;
  ufcdId: string;
  description: string; // O que fiz
  whatILearned?: string; // O que aprendi
  isGroupWork?: boolean; // Individual ou de grupo
  imageUrl?: string;
  linkUrl?: string;
}

export interface SkillEvolution {
  id: string;
  category: string;
  initialLevel: number; // 1 to 10
  finalLevel: number; // 1 to 10
  notes: string;
}

export interface FinalReflection {
  overallReflection: string;
  qWhatILearned: string;
  qMostEvolvedArea: string;
  qMostImportantActivity: string;
  qOvercomeDifficulties: string;
  qHowToApply: string;
  qFutureLearning: string;
}

export interface Closure {
  finalMessage: string;
  acknowledgements: string;
}

export interface PortfolioData {
  version: string;
  templateId: string;
  course: CourseInfo;
  profile: PersonalProfile;
  ufcds: UFCD[];
  featuredProjects: FeaturedProject[];
  skillEvolutions: SkillEvolution[];
  finalReflection: FinalReflection;
  closure: Closure;
  theme: ThemeConfig;
}
