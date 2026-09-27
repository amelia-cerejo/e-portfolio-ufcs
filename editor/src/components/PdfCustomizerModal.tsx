import React, { useMemo, useRef, useState } from 'react';
import { Download, Printer, RotateCcw, X } from 'lucide-react';
import { PdfOptions, PortfolioData } from '../types';
import { generatePdfHtml, normalizePdfOptions } from '../utils/pdf';
import { normalizeSections, sectionLabels } from '../utils/sections';

interface Props {
  data: PortfolioData;
  onSave: (options: PdfOptions, publishedPdf: PortfolioData['publishedPdf']) => void;
  onClose: () => void;
}

export const PdfCustomizerModal: React.FC<Props> = ({ data, onSave, onClose }) => {
  const [options, setOptions] = useState(() => normalizePdfOptions(data));
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState('');
  const [publishedPdf, setPublishedPdf] = useState(data.publishedPdf);
  const frame = useRef<HTMLIFrameElement>(null);
  const html = useMemo(() => generatePdfHtml(data, options), [data, options]);
  const update = <K extends keyof PdfOptions>(key: K, value: PdfOptions[K]) => setOptions(current => ({ ...current, [key]: value }));
  const toggle = (key: 'sections' | 'pageBreaks' | 'ufcdIds' | 'projectIds', id: string) => {
    setOptions(current => ({ ...current, [key]: current[key].includes(id as never) ? current[key].filter(item => item !== id) : [...current[key], id] } as PdfOptions));
  };
  const save = () => onSave(options, publishedPdf);
  const finish = () => { save(); onClose(); };
  const attachPdf = async (file?: File) => {
    if (!file) return;
    setError('');
    if (file.size > 15 * 1024 * 1024 || new TextDecoder().decode(await file.slice(0, 5).arrayBuffer()) !== '%PDF-') {
      setError('Escolhe um ficheiro PDF válido com até 15 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const attachment = { name: file.name, dataUrl: `data:application/pdf;base64,${String(reader.result).split(',')[1]}`, sourceHtml: html };
      setPublishedPdf(attachment);
      onSave(options, attachment);
    };
    reader.onerror = () => setError('Não foi possível ler o PDF. Tenta novamente.');
    reader.readAsDataURL(file);
  };
  const download = () => {
    save();
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'e-portefolio-para-imprimir.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };
  const print = async () => {
    const win = frame.current?.contentWindow;
    if (!win || !options.sections.length) return;
    setPrinting(true);
    setError('');
    try {
      const images = Array.from<HTMLImageElement>(frame.current?.contentDocument?.querySelectorAll<HTMLImageElement>('img') || []);
      await Promise.all(images.map(image => image.complete ? Promise.resolve() : new Promise<void>(resolve => {
        const done = () => { clearTimeout(timeout); image.removeEventListener('load', done); image.removeEventListener('error', done); resolve(); };
        const timeout = setTimeout(done, 5000);
        image.addEventListener('load', done);
        image.addEventListener('error', done);
      })));
      save();
      win.focus();
      win.print();
    } catch {
      setError('Não foi possível abrir a impressão. Tenta novamente depois de a pré-visualização carregar.');
    } finally { setPrinting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="pdf-title" className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-700">
          <h2 id="pdf-title" className="text-lg font-bold">Preparar PDF</h2>
          <button type="button" onClick={finish} aria-label="Fechar e guardar opções PDF" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
        </header>
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[340px_minmax(0,1fr)] md:overflow-hidden">
          <div className="space-y-5 p-5 md:overflow-y-auto">
            <fieldset className="space-y-2"><legend className="font-semibold">PDF no site final</legend>
              <p className="text-sm">Guarda o PDF pela impressão e adiciona aqui esse ficheiro. O ZIP inclui a versão escolhida, sem configurações para os visitantes.</p>
              <label className="block text-sm font-semibold">Adicionar PDF ao site<input type="file" accept="application/pdf,.pdf" className="mt-2 block w-full text-sm" onChange={event => { void attachPdf(event.target.files?.[0]); event.target.value = ''; }} /></label>
              {publishedPdf && <><p className="break-words text-sm">{publishedPdf.name}</p><p role="status" className="text-sm">{publishedPdf.sourceHtml === html ? 'PDF pronto para incluir no site.' : 'O conteúdo ou as opções mudaram. Guarda e adiciona novamente o PDF atualizado.'}</p><button type="button" className="text-sm underline" onClick={() => { setPublishedPdf(undefined); onSave(options, undefined); }}>Remover PDF do site</button></>}
              <p className="text-xs text-slate-500">O PDF será público com o site. Revê também o seu conteúdo antes de partilhar. Máximo: 15 MB. Guarda o projeto .eportfolio para conservar o PDF; ficheiros grandes podem exceder a gravação automática do navegador.</p>
            </fieldset>
            <div className="flex items-center justify-between"><h3 className="font-semibold">Página A4</h3><button type="button" aria-label="Restaurar opções PDF" title="Restaurar opções PDF" onClick={() => setOptions(normalizePdfOptions({ ...data, pdfOptions: undefined }))} className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><RotateCcw className="h-4 w-4" /></button></div>
            <label className="block text-sm">Orientação<select aria-label="Orientação PDF" value={options.orientation} onChange={event => update('orientation', event.target.value as PdfOptions['orientation'])} className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-800"><option value="portrait">Vertical</option><option value="landscape">Horizontal</option></select></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">Letra<select aria-label="Tamanho de letra PDF" value={options.fontSize} onChange={event => update('fontSize', Number(event.target.value) as PdfOptions['fontSize'])} className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-800">{[10, 11, 12, 14].map(size => <option key={size} value={size}>{size} pt</option>)}</select></label>
              <label className="text-sm">Margens<select aria-label="Margens PDF" value={options.margin} onChange={event => update('margin', Number(event.target.value) as PdfOptions['margin'])} className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-800">{[10, 15, 20].map(size => <option key={size} value={size}>{size} mm</option>)}</select></label>
            </div>
            <fieldset className="space-y-2"><legend className="mb-2 font-semibold">Conteúdo</legend>
              {(['includeImages', 'includeReflections', 'includeDifficulties'] as const).map((key, index) => <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options[key]} onChange={event => update(key, event.target.checked)} />{['Imagens', 'Reflexões e aprendizagens dos projetos', 'Dificuldades e estratégias'][index]}</label>)}
            </fieldset>
            <fieldset><legend className="mb-2 font-semibold">Secções</legend>
              <div className="mb-2 grid grid-cols-[minmax(0,1fr)_70px] gap-2 text-xs text-slate-500"><span>Incluir</span><span>Página nova</span></div>
              {normalizeSections(data.sections).map(section => <div key={section.id} className="grid grid-cols-[minmax(0,1fr)_70px] items-center gap-2 border-t border-slate-200 py-2 dark:border-slate-700">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options.sections.includes(section.id)} onChange={() => toggle('sections', section.id)} />{section.id === 'capa' ? 'Capa' : sectionLabels[section.id]}</label>
                <input type="checkbox" aria-label={`Página nova: ${sectionLabels[section.id]}`} checked={options.pageBreaks.includes(section.id)} disabled={!options.sections.includes(section.id) || section.id === 'capa'} onChange={() => toggle('pageBreaks', section.id)} />
              </div>)}
            </fieldset>
            {options.sections.includes('ufcds') && <details open><summary className="cursor-pointer font-semibold">UFCD ({options.ufcdIds.length}/{data.ufcds.length})</summary><div className="mt-3 space-y-2">{data.ufcds.map(item => <label key={item.id} className="flex items-start gap-2 text-sm"><input type="checkbox" checked={options.ufcdIds.includes(item.id)} onChange={() => toggle('ufcdIds', item.id)} />{item.code} {item.name}</label>)}<label className="flex items-center gap-2 border-t pt-2 text-sm"><input type="checkbox" checked={options.eachUfcdNewPage} onChange={event => update('eachUfcdNewPage', event.target.checked)} />Cada UFCD numa página nova</label></div></details>}
            {options.sections.includes('trabalhos') && <details open><summary className="cursor-pointer font-semibold">Projetos ({options.projectIds.length}/{data.featuredProjects.length})</summary><div className="mt-3 space-y-2">{data.featuredProjects.length ? data.featuredProjects.map(item => <label key={item.id} className="flex items-start gap-2 text-sm"><input type="checkbox" checked={options.projectIds.includes(item.id)} onChange={() => toggle('projectIds', item.id)} />{item.title}</label>) : <p className="text-sm text-slate-500">Sem projetos adicionados.</p>}</div></details>}
          </div>
          <div className="flex min-h-[420px] flex-col border-t border-slate-200 bg-slate-100 md:border-l md:border-t-0 dark:border-slate-700">
            <div className="px-4 py-3 text-xs text-slate-600">Pré-visualização do conteúdo. As linhas tracejadas indicam quebras escolhidas; a paginação final aparece na janela de impressão.</div>
            {options.sections.length ? <iframe ref={frame} title="Pré-visualização PDF" srcDoc={html} sandbox="allow-same-origin allow-modals" className="min-h-[360px] w-full flex-1 border-0" /> : <p className="p-8 text-center text-slate-600">Escolhe pelo menos uma secção para preparar o PDF.</p>}
          </div>
        </div>
        <footer className="shrink-0 border-t border-slate-200 px-5 py-3 dark:border-slate-700">
          {error && <p role="alert" className="mb-2 text-sm text-red-700">{error}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">Na impressão, escolhe “Guardar como PDF”. Nada é publicado.</p><div className="flex flex-wrap gap-2"><button type="button" onClick={finish} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">Concluído</button><button type="button" onClick={download} disabled={!options.sections.length} title="Descarregar HTML para abrir no Chrome ou Edge e guardar como PDF" className="flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50"><Download className="h-4 w-4" />Versão para imprimir</button><button type="button" onClick={print} disabled={printing || !options.sections.length} className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Printer className="h-4 w-4" />{printing ? 'A preparar...' : 'Guardar PDF / Imprimir'}</button></div></div>
        </footer>
      </div>
    </div>
  );
};
