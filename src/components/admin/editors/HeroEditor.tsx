import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { HeroContent } from '../../../types/content';
import { AdminInput, AdminTextarea, AdminListEditor, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function HeroEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<HeroContent>({ ...content.hero });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('hero', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <AdminInput
          label="Дата окончания таймера (ISO)"
          type="datetime-local"
          value={data.countdownDate.slice(0, 16)}
          onChange={(e) => setData({ ...data, countdownDate: new Date(e.target.value).toISOString() })}
        />
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
