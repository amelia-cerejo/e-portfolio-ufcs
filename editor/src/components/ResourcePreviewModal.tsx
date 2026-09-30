import React from 'react';
import { ExternalLink, X } from 'lucide-react';

interface Props {
  title: string;
  url: string;
  externalUrl?: string;
  embedUrl?: string;
  onClose: () => void;
}

export const isPreviewableImage = (url: string) => /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(url) || /\.(?:png|jpe?g|webp|gif)(?:[?#]|$)/i.test(url);
export const isSafeResource = (url: string) => /^https?:\/\//i.test(url) || /^data:(?:image\/(?:png|jpeg|webp|gif)|application\/pdf);base64,/i.test(url);
export const isOfficeDocumentUrl = (url: string) => /\.(?:docx?|xlsx?|pptx?)(?:[?#]|$)/i.test(url);

export const ResourcePreviewModal: React.FC<Props> = ({ title, url, externalUrl, embedUrl, onClose }) => {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const safeEmbed = Boolean(embedUrl && /^https:\/\//i.test(embedUrl));
  if (!isSafeResource(url) && !safeEmbed) return null;
  const image = isPreviewableImage(url);
  const viewerUrl = safeEmbed ? embedUrl! : url;
  const requiresEmbed = isOfficeDocumentUrl(url) && viewerUrl === url;
  return <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-3 sm:p-6">
    <div role="dialog" aria-modal="true" aria-label={title} className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <h2 className="min-w-0 truncate text-base font-bold text-slate-900">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Fechar visualização" className="rounded p-2 text-slate-700 hover:bg-slate-100"><X className="h-5 w-5" /></button>
      </header>
      <div className="min-h-0 flex-1 bg-slate-100">
        {image ? <img src={url} alt={title} className="h-full w-full object-contain" /> : requiresEmbed ? <div className="flex h-full items-center justify-center p-6 text-center text-slate-700">Este ficheiro Office precisa de uma ligação de incorporação para ser visto nesta janela. Usa «Abrir numa nova aba» ou acrescenta essa ligação ao editar o trabalho.</div> : <iframe src={viewerUrl} title={title} className="h-full w-full border-0" referrerPolicy="no-referrer" />}
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-sm text-slate-600">
        <span>Se o conteúdo não aparecer, abre a ligação diretamente.</span>
        <div className="flex gap-2">
          {(externalUrl && /^https?:\/\//i.test(externalUrl) ? externalUrl : !url.startsWith('data:') ? url : '') && <a href={externalUrl && /^https?:\/\//i.test(externalUrl) ? externalUrl : url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 font-semibold text-white"><ExternalLink className="h-4 w-4" />Abrir numa nova aba</a>}
          <button type="button" onClick={onClose} className="rounded-md border px-3 py-2 font-semibold">Fechar</button>
        </div>
      </footer>
    </div>
  </div>;
};
