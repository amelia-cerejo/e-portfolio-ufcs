import { PortfolioData, PortfolioSectionId } from '../types';
import { visibleSections } from './sections';
import type { PublicExportOptions } from './generateStandaloneHtml';

const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character] || character));

const paragraph = (value: unknown) => value ? `<p>${escape(value)}</p>` : '';
const safeLink = (url: string) => /^https?:\/\//i.test(url) ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">Abrir trabalho</a>` : '';
const imageHtml = (url: string | undefined, alt: string) => url && /^(https?:\/\/|data:image\/(png|jpeg|webp|gif);base64,)/i.test(url) ? `<img src="${escape(url)}" alt="${escape(alt)}" style="max-width:100%;max-height:320px;object-fit:contain">` : '';

export function generateConfigurableHtml(data: PortfolioData, options: PublicExportOptions, selectedSections = visibleSections(data)): string {
  const name = data.profile.studentName || 'Portefólio';
  const sections: Record<PortfolioSectionId, () => string> = {
    capa: () => `<section class="cover">
      ${options.includeImages !== false && data.theme.customBannerUrl ? `<img class="banner" src="${escape(data.theme.customBannerUrl)}" alt="Imagem de capa">` : ''}
      <div class="cover-text"><p>E-Portefólio Digital</p><h1>${escape(name)}</h1>
      ${options.includeImages !== false ? imageHtml(data.profile.studentPhoto, name) : ''}
      ${paragraph(data.course.actionTitle)}${paragraph(data.profile.presentationPhrase)}</div></section>`,
    sobre: () => `<section><h2>Sobre mim</h2>
      ${options.includeBio !== false ? paragraph(data.profile.bio) : ''}
      ${options.includeBackground !== false ? paragraph(data.profile.background) : ''}
      ${data.profile.courseObjectives ? `<h3>Objetivos</h3>${paragraph(data.profile.courseObjectives)}` : ''}
      ${data.profile.skills.length ? `<h3>Competências</h3><ul>${data.profile.skills.map((skill) => `<li>${escape(skill.name)}</li>`).join('')}</ul>` : ''}
      ${data.profile.interests.length ? `<h3>Interesses</h3><ul>${data.profile.interests.map((interest) => `<li>${escape(interest)}</li>`).join('')}</ul>` : ''}
      ${[data.profile.email, data.profile.phone, data.profile.location, data.profile.linkedin, data.profile.github, data.profile.website].filter(Boolean).length ? `<h3>Contactos</h3>${[data.profile.email, data.profile.phone, data.profile.location, data.profile.linkedin, data.profile.github, data.profile.website].filter(Boolean).map(paragraph).join('')}` : ''}</section>`,
    formacao: () => `<section><h2>A minha formação</h2>
      ${paragraph(data.course.actionTitle)}${data.course.actionNumber ? `<p>Ação ${escape(data.course.actionNumber)}</p>` : ''}
      ${paragraph(data.course.entityName)}${paragraph(data.course.modality)}${paragraph(data.course.duration)}
      ${paragraph(data.course.program)}${paragraph(data.course.trainingArea)}${paragraph(data.course.location)}
      ${data.course.startDate ? `<p>Início: ${escape(data.course.startDate)}</p>` : ''}
      ${data.course.endDate ? `<p>Fim: ${escape(data.course.endDate)}</p>` : ''}
      ${options.includeTrainerName !== false ? paragraph(data.course.trainerName) : ''}
      ${paragraph(data.course.framing)}
      ${data.course.generalObjectives?.length ? `<h3>Objetivos gerais</h3>${Array.isArray(data.course.generalObjectives) ? `<ul>${data.course.generalObjectives.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>` : paragraph(data.course.generalObjectives)}` : ''}
      ${data.course.specificObjectives?.length ? `<h3>Objetivos específicos</h3>${Array.isArray(data.course.specificObjectives) ? `<ul>${data.course.specificObjectives.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>` : paragraph(data.course.specificObjectives)}` : ''}</section>`,
    percurso: () => `<section><h2>O meu percurso</h2><ol>${data.ufcds.map((ufcd) => `<li><strong>${escape(ufcd.code)} ${escape(ufcd.name)}</strong>${ufcd.hours ? ` · ${ufcd.hours} horas` : ''}</li>`).join('')}</ol></section>`,
    ufcds: () => data.ufcds.map((ufcd) => `<section><h2>UFCD ${escape(ufcd.code)} · ${escape(ufcd.name)}</h2>
      ${ufcd.hours ? `<p>${ufcd.hours} horas</p>` : ''}
      ${options.includeTrainerName !== false && ufcd.trainer ? `<p>Formador(a): ${escape(ufcd.trainer)}</p>` : ''}
      <h3>O que aprendi</h3>${paragraph(ufcd.whatILearned)}<h3>Atividades</h3>${paragraph(ufcd.activitiesDone)}
      ${options.includeDifficulties !== false ? `<h3>Dificuldades e estratégias</h3>${paragraph(ufcd.difficultiesFaced)}${paragraph(ufcd.howIOvercame)}` : ''}
      <h3>Competências desenvolvidas</h3>${paragraph(ufcd.skillsDeveloped)}
      ${options.includeReflections !== false ? `<h3>Reflexão</h3>${paragraph(ufcd.finalReflection)}` : ''}
      ${ufcd.evidences.length ? `<h3>Evidências</h3><ul>${ufcd.evidences.map((evidence) => `<li><strong>${escape(evidence.title)}</strong> ${escape(evidence.description)} ${options.includeImages !== false && evidence.type === 'image' ? imageHtml(evidence.url, evidence.title) : ''} ${safeLink(evidence.url)}</li>`).join('')}</ul>` : ''}</section>`).join(''),
    trabalhos: () => `<section><h2>Trabalhos e projetos</h2>${data.featuredProjects.map((project) => `<article><h3>${escape(project.title)}</h3>${options.includeImages !== false && project.imageUrl ? `<img src="${escape(project.imageUrl)}" alt="${escape(project.title)}">` : ''}${paragraph(project.context)}${paragraph(project.description)}${options.includeReflections !== false ? paragraph(project.whatILearned) : ''}${project.linkUrl ? safeLink(project.linkUrl) : ''}</article>`).join('')}</section>`,
    evolucao: () => `<section><h2>Evolução das competências</h2>${data.skillEvolutions.map((skill) => `<article><h3>${escape(skill.category)}</h3><p>${skill.initialLevel} → ${skill.finalLevel}</p>${paragraph(skill.notes)}</article>`).join('')}</section>`,
    'reflexao-final': () => options.includeReflections === false ? '' : `<section><h2>Reflexão final</h2>${paragraph(data.finalReflection.overallReflection)}${[
      ['O que aprendi', data.finalReflection.qWhatILearned], ['Em que área evoluí mais', data.finalReflection.qMostEvolvedArea],
      ['A atividade mais importante', data.finalReflection.qMostImportantActivity], ['Dificuldades ultrapassadas', data.finalReflection.qOvercomeDifficulties],
      ['Como aplicar as aprendizagens', data.finalReflection.qHowToApply], ['O que quero continuar a aprender', data.finalReflection.qFutureLearning],
    ].filter(([, value]) => value).map(([label, value]) => `<h3>${escape(label)}</h3>${paragraph(value)}`).join('')}</section>`,
    certificacao: () => `<section><h2>Certificação</h2><p>Registo da certificação do percurso, quando aplicável.</p></section>`,
    encerramento: () => `<section><h2>Encerramento</h2>${paragraph(data.closure.finalMessage)}${paragraph(data.closure.acknowledgements)}</section>`,
  };

  return `<!doctype html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>E-Portefólio · ${escape(name)}</title>
    <style>body{margin:0;background:#f6f7fb;color:#19223b;font:16px/1.6 system-ui,sans-serif}main{max-width:900px;margin:auto;padding:24px}section{background:#fff;border:1px solid #dde2ed;border-radius:8px;padding:28px;margin:0 0 24px}h1,h2,h3{line-height:1.25}h1{font-size:2.5rem}h2{font-size:1.5rem}h3{font-size:1.1rem;margin-bottom:4px}article{border-top:1px solid #e5e9f2;padding:12px 0}p{white-space:pre-line}a{color:#5132a7}.cover{padding:0;overflow:hidden}.banner{width:100%;height:280px;object-fit:cover}.cover-text{padding:28px}li{margin:6px 0}@media(max-width:600px){main{padding:12px}section{padding:18px}.cover-text{padding:18px}h1{font-size:2rem}}</style></head>
    <body><main>${selectedSections.map((id) => { const content = sections[id](); return content ? `<div class="portfolio-section" data-section="${id}">${content}</div>` : ''; }).join('')}</main></body></html>`;
}
