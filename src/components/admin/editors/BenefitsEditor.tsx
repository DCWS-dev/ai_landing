import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { BenefitsContent, BenefitStat } from '../../../types/content';
import { AdminInput, AdminListEditor, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function BenefitsEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<BenefitsContent>(JSON.parse(JSON.stringify(content.benefits)));
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('benefits', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateStat = (index: number, stat: BenefitStat) => {
    const stats = [...data.stats];
    stats[index] = stat;
    setData({ ...data, stats });
  };

  const addStat = () => {
    setData({ ...data, stats: [...data.stats, { value: '', label: '' }] });
  };

  const removeStat = (index: number) => {
    setData({ ...data, stats: data.stats.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <AdminSectionHeader title="Выгоды и результаты" description="Цифры, факты и сценарии" />
      <div className="space-y-4">
        <AdminInput label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />

        <div>
          <label className="block text-sm text-text-secondary mb-2">Статистика</label>
          {data.stats.map((stat, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={stat.value}
                onChange={(e) => updateStat(i, { ...stat, value: e.target.value })}
                className="w-24 px-3 py-2 rounded-lg bg-surface border border-contrast/10 text-text-primary text-sm focus:border-primary focus:outline-none"
                placeholder="10+"
              />
              <input
                value={stat.label}
                onChange={(e) => updateStat(i, { ...stat, label: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-surface border border-contrast/10 text-text-primary text-sm focus:border-primary focus:outline-none"
                placeholder="часов экономии"
              />
              <button onClick={() => removeStat(i)} className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm cursor-pointer">✕</button>
            </div>
          ))}
          <button onClick={addStat} className="px-4 py-2 rounded-lg border border-dashed border-contrast/20 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
            + Добавить
          </button>
        </div>

        <AdminListEditor label="Сценарии (что сможешь после марафона)" items={data.scenarios} onChange={(scenarios) => setData({ ...data, scenarios })} />
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
