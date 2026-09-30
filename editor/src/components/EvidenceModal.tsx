import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { EvidenceItem, EvidenceType } from '../types';

interface EvidenceModalProps {
  ufcdId: string;
  evidence?: EvidenceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (ufcdId: string, evidence: Omit<EvidenceItem, 'id'>) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  ufcdId,
  evidence,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EvidenceType>('image');
  const [url, setUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('pt-PT'));
  const [isGroupWork, setIsGroupWork] = useState(false);
  const [imageData, setImageData] = useState('');
  const [imageError, setImageError] = useState('');

  React.useEffect(() => {
    if (!isOpen) return;
    setTitle(evidence?.title || '');
    setType(evidence?.type || 'image');
    setUrl(evidence?.url || '');
    setEmbedUrl(evidence?.embedUrl || '');
    setDescription(evidence?.description || '');
    setDate(evidence?.date || new Date().toLocaleDateString('pt-PT'));
    setIsGroupWork(Boolean(evidence?.isGroupWork));
    setImageData(evidence?.imageData || '');
    setImageError('');
  }, [isOpen, evidence]);

  const chooseImage = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setImageError('Escolhe uma imagem JPG, PNG ou WebP até 2 MB.');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => setImageData(String(reader.result));
    reader.onerror = () => setImageError('Não foi possível ler a imagem. Tenta novamente.');
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(ufcdId, {
      ufcdId,
      title,
      type,
      url,
      embedUrl,
      imageData: type === 'image' ? imageData : '',
      description,
      date,
      isGroupWork,
    });

    // Reset
    setTitle('');
    setUrl('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{evidence ? 'Editar Evidência' : 'Adicionar Nova Evidência'}</h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título da Evidência
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Trabalho Prático de Excel / Manual Formatado"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {type === 'image' && <div className="space-y-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">Imagem da evidência</label>
            {imageData && <img src={imageData} alt="Pré-visualização da evidência" className="h-28 w-full rounded-md object-contain bg-slate-100" />}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { chooseImage(event.target.files?.[0]); event.target.value = ''; }} className="block w-full" />
            {imageData && <button type="button" onClick={() => setImageData('')} className="text-indigo-600 underline">Remover imagem</button>}
            <p className="text-slate-500">JPG, PNG ou WebP até 2 MB. A imagem fica guardada no projeto; a ligação para o trabalho é opcional.</p>
            {imageError && <p role="alert" className="text-red-700">{imageError}</p>}
          </div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tipo de Evidência
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EvidenceType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="image">Fotografia / Captura de ecrã</option>
                <option value="document">Documento (PDF/Word)</option>
                <option value="presentation">Apresentação (PowerPoint/Canva)</option>
                <option value="video">Vídeo (YouTube/Vimeo)</option>
                <option value="google_drive">Google Drive</option>
                <option value="link">Ligação Web Externa</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data do Trabalho
              </label>
              <input
                type="text"
                placeholder="Ex: 15/02/2026"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ligação para o trabalho (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: https://drive.google.com/file/d/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {(type === 'document' || type === 'presentation') && <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ligação de incorporação (Word, Excel ou PowerPoint)</label>
            <input type="url" value={embedUrl} onChange={(event) => setEmbedUrl(event.target.value)} placeholder="https://..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <p className="mt-1 text-slate-500">No OneDrive/SharePoint, copia o endereço de incorporação do ficheiro (o valor de src no iframe). Confirma as permissões antes de partilhar.</p>
          </div>}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição / Contexto da Evidência
            </label>
            <textarea
              rows={3}
              placeholder="Descreva resumidamente o objetivo e o resultado deste trabalho..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="groupCheck"
              checked={isGroupWork}
              onChange={(e) => setIsGroupWork(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="groupCheck" className="font-semibold text-slate-700 dark:text-slate-300">
              Trabalho realizado em Grupo
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{evidence ? 'Guardar alterações' : 'Guardar evidência'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
