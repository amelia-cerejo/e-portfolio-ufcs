import React from 'react';
import { X, Save } from 'lucide-react';

interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'url';
  rows?: number;
}

interface EditModalProps {
  title: string;
  fields: FieldConfig[];
  initialValues: Record<string, any>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, any>) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  title,
  fields,
  initialValues,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialValues);

  React.useEffect(() => {
    setFormData(initialValues);
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                {field.label}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={field.rows || 4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              )}
            </div>
          ))}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
