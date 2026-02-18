import { useState, useMemo } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { HeroContent } from '../../../types/content';
import { AdminInput, AdminTextarea, AdminListEditor, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

function formatTimeLeft(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return 'Таймер завершён';
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  return `${d} дн. ${h} ч. ${m} мин.`;
}

export function HeroEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<HeroContent>({ ...content.hero });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('hero', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const timerDate = useMemo(() => {
    try {
      const d = new Date(data.countdownDate);
      return d.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  }, [data.countdownDate]);

  const timerPreview = useMemo(() => formatTimeLeft(data.countdownDate), [data.countdownDate]);

  const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    setData({ ...data, countdownDate: new Date(val).toISOString() });
  };

  return (
    <div>
      <AdminSectionHeader title="Hero / Шапка" description="Главный экран лендинга — первое, что видит посетитель" />
      <div className="space-y-4">
        <AdminTextarea label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="min-h-[120px]" />
        <AdminTextarea label="Подзаголовок" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className="min-h-[100px]" />
        <AdminListEditor label="Буллеты (преимущества)" items={data.bullets} onChange={(bullets) => setData({ ...data, bullets })} />
        <AdminInput label="Текст основной кнопки (CTA)" value={data.ctaText} onChange={(e) => setData({ ...data, ctaText: e.target.value })} />
        <AdminInput label="Текст вторичной кнопки" value={data.secondaryCtaText} onChange={(e) => setData({ ...data, secondaryCtaText: e.target.value })} />

        {/* Timer — nice UX */}
        <div className="p-4 rounded-xl bg-surface-light border border-contrast/10">
          <label className="block text-sm font-semibold text-text-primary mb-3">⏱ Обратный отсчёт</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-muted mb-1">Дата и время старта</label>
              <input
                type="datetime-local"
                value={timerDate}
                onChange={handleTimerChange}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-contrast/10 text-text-primary focus:border-primary focus:outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Осталось</label>
              <div className="px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-semibold text-sm">
                {timerPreview}
              </div>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-2">Таймер на лендинге будет отсчитывать время до этой даты</p>
        </div>
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
