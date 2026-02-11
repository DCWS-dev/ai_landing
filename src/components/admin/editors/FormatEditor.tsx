import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { FormatContent } from '../../../types/content';
import { AdminInput, AdminListEditor, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function FormatEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<FormatContent>(JSON.parse(JSON.stringify(content.format)));
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('format', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateTimeline = (index: number, field: 'day' | 'description', value: string) => {
    const timeline = [...data.timeline];
    timeline[index] = { ...timeline[index], [field]: value };
    setData({ ...data, timeline });
  };

  const addTimeline = () => {
    setData({ ...data, timeline: [...data.timeline, { day: `День ${data.timeline.length + 1}`, description: '' }] });
  };

  const removeTimeline = (index: number) => {
    setData({ ...data, timeline: data.timeline.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <AdminSectionHeader title="Формат марафона" description="Описание формата и таймлайн по дням" />
      <div className="space-y-4">
        <AdminInput label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <AdminListEditor label="Особенности формата" items={data.features} onChange={(features) => setData({ ...data, features })} />

        <div>
          <label className="block text-sm text-text-secondary mb-2">Таймлайн</label>
          {data.timeline.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={item.day}
                onChange={(e) => updateTimeline(i, 'day', e.target.value)}
                className="w-24 px-3 py-2 rounded-lg bg-surface border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
                placeholder="День N"
              />
              <input
                value={item.description}
                onChange={(e) => updateTimeline(i, 'description', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-surface border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
                placeholder="Описание"
              />
              <button onClick={() => removeTimeline(i)} className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm cursor-pointer">✕</button>
            </div>
          ))}
          <button onClick={addTimeline} className="px-4 py-2 rounded-lg border border-dashed border-white/20 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
            + Добавить день
          </button>
        </div>
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
