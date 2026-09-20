import { PortfolioData } from '../types';

export interface PublicExportOptions {
  includeBio?: boolean;
  includeBackground?: boolean;
  includeDifficulties?: boolean;
  includeReflections?: boolean;
  includeTrainerName?: boolean;
}

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates a complete standalone static HTML file containing the portfolio.
 * - Supports selective inclusion/exclusion of private content fields.
 * - Embedded CSS fallback guarantees rendering without internet connectivity.
 * - CDN Tailwind CSS is loaded when online for enhanced styling.
 */
export function generateStandaloneHtml(data: PortfolioData, options: PublicExportOptions = {}): string {
  const {
    includeBio = true,
    includeBackground = true,
    includeDifficulties = true,
    includeReflections = true,
    includeTrainerName = true,
  } = options;

  const studentName = data.profile?.studentName || 'Formando';
  const actionNum = data.course?.actionNumber || '';
  const actionTitle = data.course?.actionTitle || '';
  const entity = data.course?.entityName || '';

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Portefólio — ${escapeHtml(studentName)}</title>

  <!-- Online Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Offline Fallback Stylesheet for 100% Internet-free compatibility -->
  <style>
    :root { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    body { background-color: #f8fafc; color: #0f172a; margin: 0; padding-bottom: 4rem; line-height: 1.5; }
    .max-w-5xl { max-width: 64rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .bg-white { background-color: #ffffff; }
    .border { border-style: solid; border-width: 1px; }
    .border-slate-200 { border-color: #e2e8f0; }
    .rounded-3xl { border-radius: 1.5rem; }
    .p-8 { padding: 2rem; }
    .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .space-y-8 > * + * { margin-top: 2rem; }
    .space-y-12 > * + * { margin-top: 3rem; }
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    @media (min-width: 640px) {
      .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    }
    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .font-bold { font-weight: 700; }
    .font-extrabold { font-weight: 800; }
    .text-slate-900 { color: #0f172a; }
    .text-slate-700 { color: #334155; }
    .text-slate-600 { color: #475569; }
    .text-slate-500 { color: #64748b; }
    .text-indigo-600 { color: #4f46e5; }
    .bg-slate-50 { background-color: #f8fafc; }
    .bg-indigo-600 { background-color: #4f46e5; }
    .text-white { color: #ffffff; }
    a { color: #4f46e5; text-decoration: underline; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen selection:bg-indigo-500 selection:text-white pb-16">
  
  <!-- Standalone Read-Only Banner -->
  <div class="no-print bg-indigo-900 text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2">
    <span>✨ Versão Estática Autónoma do E-Portefólio (Apenas Leitura)</span>
    ${actionNum || entity ? `<span class="opacity-60">•</span><span>${actionNum ? `Ação nº ${escapeHtml(actionNum)}` : 'Formação'}${entity ? ` — ${escapeHtml(entity)}` : ''}</span>` : ''}
  </div>

  <!-- Header Container -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <div>
        <h1 class="text-base font-extrabold text-slate-900">E-Portefólio de Formação</h1>
        <p class="text-xs text-slate-500">${escapeHtml(studentName)}${actionTitle ? ` — ${escapeHtml(actionTitle)}` : ''}</p>
      </div>
      <button onclick="window.print()" class="no-print px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200">
        🖨️ Imprimir / PDF
      </button>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
    
    <!-- Capa / Cover -->
    <section class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 text-center">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
        ${actionNum ? `Ação de Formação nº ${escapeHtml(actionNum)}` : 'E-Portefólio Digital'}
      </span>
      <h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">
        ${escapeHtml(actionTitle || 'A minha formação')}
      </h2>
      <p class="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
        ${escapeHtml(data.profile?.presentationPhrase || '')}
      </p>
      <div class="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium">
        <div>Formando: <strong class="text-slate-800">${escapeHtml(studentName)}</strong></div>
        ${entity ? `<div>Entidade: <strong class="text-slate-800">${escapeHtml(entity)}</strong></div>` : ''}
        ${data.course?.duration ? `<div>Duração: <strong class="text-slate-800">${escapeHtml(data.course.duration)}</strong></div>` : ''}
      </div>
    </section>

    <!-- Sobre Mim (Filtered by options) -->
    ${includeBio || (includeBackground && data.profile?.background) ? `
      <section class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          👤 Sobre Mim
        </h3>
        ${includeBio && data.profile?.bio ? `
          <p class="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            ${escapeHtml(data.profile.bio)}
          </p>
        ` : ''}
        ${includeBackground && data.profile?.background ? `
          <div class="pt-4 border-t border-slate-100">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Percurso Anterior</h4>
            <p class="text-slate-600 text-xs leading-relaxed">${escapeHtml(data.profile.background)}</p>
          </div>
        ` : ''}
      </section>
    ` : ''}

    <!-- A Minha Formação -->
    <section class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
      <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
        🎓 A Minha Formação
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div><strong>Formação:</strong> ${escapeHtml(actionTitle || 'Por preencher')}${actionNum ? ` (${escapeHtml(actionNum)})` : ''}</div>
        ${data.course?.program ? `<div><strong>Programa:</strong> ${escapeHtml(data.course.program)}</div>` : ''}
        ${entity ? `<div><strong>Entidade Formadora:</strong> ${escapeHtml(entity)}</div>` : ''}
        ${data.course?.modality ? `<div><strong>Modalidade:</strong> ${escapeHtml(data.course.modality)}</div>` : ''}
        ${data.course?.duration ? `<div><strong>Duração Total:</strong> ${escapeHtml(data.course.duration)}</div>` : ''}
        ${data.course?.location ? `<div><strong>Local:</strong> ${escapeHtml(data.course.location)}</div>` : ''}
      </div>
    </section>

    <!-- O Meu Percurso -->
    <section class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
      <h3 class="text-xl font-bold text-slate-900">
        🗺️ O Meu Percurso Modular (8 UFCDs)
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${(data.ufcds || []).map((u, idx) => `
          <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
            <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              ${idx + 1}
            </span>
            <div>
              <div class="text-xs font-mono font-bold text-indigo-600">UFCD ${escapeHtml(u.code)} (${u.hours}h)</div>
              <div class="text-sm font-bold text-slate-900 mt-0.5">${escapeHtml(u.name)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Páginas das UFCDs -->
    <section class="space-y-8">
      <h3 class="text-2xl font-extrabold text-slate-900">
        📚 Páginas Individuais das UFCDs
      </h3>

      ${(data.ufcds || []).map((u) => `
        <article class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">UFCD ${escapeHtml(u.code)} • ${u.hours}h</span>
            <h4 class="text-xl font-extrabold text-slate-900 mt-2">${escapeHtml(u.name)}</h4>
            ${includeTrainerName && u.trainer ? `<p class="text-xs text-slate-500 mt-1">Formador(a): ${escapeHtml(u.trainer)}</p>` : ''}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong class="text-slate-900 font-bold block text-sm">📖 O que aprendi:</strong>
              <p class="text-slate-600 leading-relaxed">${escapeHtml(u.whatILearned || 'Sem registo.')}</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong class="text-slate-900 font-bold block text-sm">✅ Atividades realizadas:</strong>
              <p class="text-slate-600 leading-relaxed">${escapeHtml(u.activitiesDone || 'Sem registo.')}</p>
            </div>

            ${includeDifficulties ? `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <strong class="text-slate-900 font-bold block text-sm">⚠️ Dificuldades sentidas:</strong>
                <p class="text-slate-600 leading-relaxed">${escapeHtml(u.difficultiesFaced || 'Sem registo.')}</p>
              </div>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <strong class="text-slate-900 font-bold block text-sm">💡 Estratégias utilizadas:</strong>
                <p class="text-slate-600 leading-relaxed">${escapeHtml(u.howIOvercame || 'Sem registo.')}</p>
              </div>
            ` : ''}

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 md:col-span-2">
              <strong class="text-slate-900 font-bold block text-sm">📈 Competências desenvolvidas:</strong>
              <p class="text-slate-600 leading-relaxed">${escapeHtml(u.skillsDeveloped || 'Sem registo.')}</p>
            </div>

            ${includeReflections ? `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 md:col-span-2">
                <strong class="text-slate-900 font-bold block text-sm">💬 Reflexão pessoal:</strong>
                <p class="text-slate-600 leading-relaxed">${escapeHtml(u.finalReflection || 'Sem registo.')}</p>
              </div>
            ` : ''}
          </div>

          <!-- Evidências -->
          ${u.evidences && u.evidences.length > 0 ? `
            <div class="pt-4 border-t border-slate-100">
              <h5 class="text-xs font-bold uppercase text-slate-500 mb-3">Evidências e Trabalhos (${u.evidences.length})</h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${u.evidences.map((e) => `
                  <div class="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1">
                    <div class="font-bold text-slate-900">${escapeHtml(e.title)}</div>
                    <div class="text-slate-500 text-[11px]">${escapeHtml(e.description || '')}</div>
                    ${e.url ? `<a href="${escapeHtml(e.url)}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 font-semibold underline block mt-1">Ver ficheiro/ligação ↗</a>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </article>
      `).join('')}
    </section>

    <!-- Trabalhos e Projetos -->
    ${data.featuredProjects && data.featuredProjects.length > 0 ? `
      <section class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-xl font-bold text-slate-900">📁 Trabalhos e Evidências em Destaque</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${data.featuredProjects.map((p) => `
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 class="font-bold text-slate-900 text-sm">${escapeHtml(p.title)}</h4>
              <p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(p.description)}</p>
              ${p.whatILearned ? `<p class="text-xs text-indigo-700 bg-indigo-50 p-2 rounded-lg font-medium">💡 ${escapeHtml(p.whatILearned)}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Reflexão Final -->
    ${includeReflections && data.finalReflection?.overallReflection ? `
      <section class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-xl font-bold text-slate-900">💭 Reflexão Final e Balanço de Competências</h3>
        <p class="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
          ${escapeHtml(data.finalReflection.overallReflection)}
        </p>
      </section>
    ` : ''}

  </main>

  <footer class="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-slate-400 border-t border-slate-200">
    E-Portefólio de Formação • ${escapeHtml(studentName)} • IEFP, I.P.
  </footer>

</body>
</html>`;
}
