import { PortfolioData, PortfolioSectionId } from '../types';
import { visibleSections } from './sections';
import type { PublicExportOptions } from './generateStandaloneHtml';

const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character] || character));

const paragraph = (value: unknown) => value ? `<p>${escape(value)}</p>` : '';
const safeLink = (url: string) => /^https?:\/\//i.test(url) ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">Abrir trabalho</a>` : '';

export function generateConfigurableHtml(data: PortfolioData, options: PublicExportOptions): string {
  const name = data.profile.studentName || 'Portefólio';
  const sections: Record<PortfolioSectionId, () => string> = {
    capa: () => `<section class="cover">
      ${data.theme.customBannerUrl ? `<img class="banner" src="${escape(data.theme.customBannerUrl)}" alt="Imagem de capa">` : ''}
      <div class="cover-text"><p>E-Portefólio Digital</p><h1>${escape(name)}</h1>
      ${paragraph(data.course.actionTitle)}${paragraph(data.profile.presentationPhrase)}</div></section>`,
    sobre: () => `<section><h2>Sobre mim</h2>
      ${options.includeBio !== false ? paragraph(data.profile.bio) : ''}
      ${options.includeBackground !== false ? paragraph(data.profile.background) : ''}
      ${data.profile.skills.length ? `<h3>Competências</h3><ul>${data.profile.skills.map((skill) => `<li>${escape(skill.name)}</li>`).join('')}</ul>` : ''}
      ${data.profile.interests.length ? `<h3>Interesses</h3><ul>${data.profile.interests.map((interest) => `<li>${escape(interest)}</li>`).join('')}</ul>` : ''}</section>`,
    formacao: () => `<section><h2>A minha formação</h2>
      ${paragraph(data.course.actionTitle)}${data.course.actionNumber ? `<p>Ação ${escape(data.course.actionNumber)}</p>` : ''}
      ${paragraph(data.course.entityName)}${paragraph(data.course.modality)}${paragraph(data.course.duration)}
      ${paragraph(data.course.framing)}
      ${data.course.generalObjectives ? `<h3>Objetivos</h3>${Array.isArray(data.course.generalObjectives) ? `<ul>${data.course.generalObjectives.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>` : paragraph(data.course.generalObjectives)}` : ''}</section>`,
    percurso: () => `<section><h2>O meu percurso</h2><ol>${data.ufcds.map((ufcd) => `<li><strong>${escape(ufcd.code)} ${escape(ufcd.name)}</strong>${ufcd.hours ? ` · ${ufcd.hours} horas` : ''}</li>`).join('')}</ol></section>`,
    ufcds: () => data.ufcds.map((ufcd) => `<section><h2>UFCD ${escape(ufcd.code)} · ${escape(ufcd.name)}</h2>
      ${options.includeTrainerName !== false && ufcd.trainer ? `<p>Formador(a): ${escape(ufcd.trainer)}</p>` : ''}
      <h3>O que aprendi</h3>${paragraph(ufcd.whatILearned)}<h3>Atividades</h3>${paragraph(ufcd.activitiesDone)}
      ${options.includeDifficulties !== false ? `<h3>Dificuldades e estratégias</h3>${paragraph(ufcd.difficultiesFaced)}${paragraph(ufcd.howIOvercame)}` : ''}
      <h3>Competências desenvolvidas</h3>${paragraph(ufcd.skillsDeveloped)}
      ${options.includeReflections !== false ? `<h3>Reflexão</h3>${paragraph(ufcd.finalReflection)}` : ''}
      ${ufcd.evidences.length ? `<h3>Evidências</h3><ul>${ufcd.evidences.map((evidence) => `<li><strong>${escape(evidence.title)}</strong> ${escape(evidence.description)} ${safeLink(evidence.url)}</li>`).join('')}</ul>` : ''}</section>`).join(''),
    trabalhos: () => `<section><h2>Trabalhos e projetos</h2>${data.featuredProjects.map((project) => `<article><h3>${escape(project.title)}</h3>${paragraph(project.context)}${paragraph(project.description)}${paragraph(project.whatILearned)}${project.linkUrl ? safeLink(project.linkUrl) : ''}</article>`).join('')}</section>`,
    evolucao: () => `<section><h2>Evolução das competências</h2>${data.skillEvolutions.map((skill) => `<article><h3>${escape(skill.category)}</h3><p>${skill.initialLevel} → ${skill.finalLevel}</p>${paragraph(skill.notes)}</article>`).join('')}</section>`,
    'reflexao-final': () => options.includeReflections === false ? '' : `<section><h2>Reflexão final</h2>${paragraph(data.finalReflection.overallReflection)}${paragraph(data.finalReflection.qWhatILearned)}${paragraph(data.finalReflection.qMostEvolvedArea)}${paragraph(data.finalReflection.qMostImportantActivity)}${paragraph(data.finalReflection.qOvercomeDifficulties)}${paragraph(data.finalReflection.qHowToApply)}${paragraph(data.finalReflection.qFutureLearning)}</section>`,
    certificacao: () => `<section><h2>Certificação</h2><p>Registo da certificação do percurso, quando aplicável.</p></section>`,
    encerramento: () => `<section><h2>Encerramento</h2>${paragraph(data.closure.finalMessage)}${paragraph(data.closure.acknowledgements)}</section>`,
  };

  return `<!doctype html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>E-Portefólio · ${escape(name)}</title>
    <style>body{margin:0;background:#f6f7fb;color:#19223b;font:16px/1.6 system-ui,sans-serif}main{max-width:900px;margin:auto;padding:24px}section{background:#fff;border:1px solid #dde2ed;border-radius:8px;padding:28px;margin:0 0 24px}h1,h2,h3{line-height:1.25}h1{font-size:2.5rem}h2{font-size:1.5rem}h3{font-size:1.1rem;margin-bottom:4px}article{border-top:1px solid #e5e9f2;padding:12px 0}p{white-space:pre-line}a{color:#5132a7}.cover{padding:0;overflow:hidden}.banner{width:100%;height:280px;object-fit:cover}.cover-text{padding:28px}li{margin:6px 0}@media(max-width:600px){main{padding:12px}section{padding:18px}.cover-text{padding:18px}h1{font-size:2rem}}</style></head>
    <body><main>${visibleSections(data).map((id) => sections[id]()).join('')}</main></body></html>`;
}
