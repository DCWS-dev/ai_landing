import type { InputHTMLAttributes } from 'react';

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AdminInput({ label, className = '', ...props }: AdminInputProps) {
  return (
    <div>
      <label className="block text-sm text-text-secondary mb-1">{label}</label>
      <input
        className={`w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors text-sm ${className}`}
        {...props}
      />
    </div>
  );
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function AdminTextarea({ label, className = '', ...props }: AdminTextareaProps) {
  return (
    <div>
      <label className="block text-sm text-text-secondary mb-1">{label}</label>
      <textarea
        className={`w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors text-sm min-h-[100px] resize-y ${className}`}
        {...props}
      />
    </div>
  );
}

interface AdminListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}

export function AdminListEditor({ label, items, onChange }: AdminListEditorProps) {
  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const addItem = () => onChange([...items, '']);

  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div>
      <label className="block text-sm text-text-secondary mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-surface border border-white/10 text-white text-sm focus:border-primary focus:outline-none transition-colors"
            />
            <button
              onClick={() => removeItem(i)}
              className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer"
      >
        + Добавить
      </button>
    </div>
  );
}

interface AdminSectionHeaderProps {
  title: string;
  description?: string;
}

export function AdminSectionHeader({ title, description }: AdminSectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">{title}</h2>
      {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
    </div>
  );
}

interface AdminSaveButtonProps {
  onClick: () => void;
  saved?: boolean;
}

export function AdminSaveButton({ onClick, saved }: AdminSaveButtonProps) {
  return (
    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5">
      <button
        onClick={onClick}
        className="px-6 py-2.5 rounded-lg bg-accent text-surface font-bold text-sm hover:bg-accent-light transition-colors cursor-pointer"
      >
        Сохранить изменения
      </button>
      {saved && <span className="text-sm text-neon-green">✓ Сохранено</span>}
    </div>
  );
}
