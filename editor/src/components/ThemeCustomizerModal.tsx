import React, { useState } from 'react';
import { X, Palette, Type, Image as ImageIcon, Save, Check } from 'lucide-react';
import { ThemeConfig, ThemeColor, FontStyle } from '../types';
import { themePalettes } from '../utils/theme';

interface ThemeCustomizerModalProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTheme: ThemeConfig) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  theme,
  isOpen,
  onClose,
  onSave,
}) => {
  const [color, setColor] = useState<ThemeColor>(theme.themeColor || 'indigo');
  const [font, setFont] = useState<FontStyle>(theme.fontStyle || 'sans');
  const [entityLogoUrl, setEntityLogoUrl] = useState(theme.entityLogoUrl || '');
  const [customBannerUrl, setCustomBannerUrl] = useState(theme.customBannerUrl || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...theme,
      themeColor: color,
      fontStyle: font,
      entityLogoUrl,
      customBannerUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-pink-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Identidade Visual do Portefólio</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          
          {/* Theme Color Picker */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900 dark:text-white text-sm">
              Esquema de Cores Principal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(themePalettes) as ThemeColor[]).map((key) => {
                const p = themePalettes[key];
                const isSelected = key === color;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setColor(key)}
                    className={`p-3 rounded-2xl border flex items-center gap-2 font-semibold transition text-left ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/50'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.accent }} />
                    <span className="truncate">{p.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Style Picker */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900 dark:text-white text-sm">
              Estilo Tipográfico
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFont('sans')}
                className={`p-3 rounded-2xl border font-sans font-semibold transition text-center ${
                  font === 'sans'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Sans-Serif (Moderno)
              </button>
              <button
                type="button"
                onClick={() => setFont('serif')}
                className={`p-3 rounded-2xl border font-serif font-semibold transition text-center ${
                  font === 'serif'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Serifado (Clássico)
              </button>
              <button
                type="button"
                onClick={() => setFont('mono')}
                className={`p-3 rounded-2xl border font-mono font-semibold transition text-center ${
                  font === 'mono'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Monospace (Técnico)
              </button>
            </div>
          </div>

          {/* Custom Logo URL */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL do Logótipo da Entidade Formadora
            </label>
            <input
              type="text"
              placeholder="https://exemplo.com/logo.png"
              value={entityLogoUrl}
              onChange={(e) => setEntityLogoUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Custom Banner Image URL */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL da Imagem de Banner da Capa
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/photo-..."
              value={customBannerUrl}
              onChange={(e) => setCustomBannerUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
              className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Aplicar Identidade Visual</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
