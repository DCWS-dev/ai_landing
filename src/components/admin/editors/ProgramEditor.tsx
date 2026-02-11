import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { ProgramContent, ProgramDay } from '../../../types/content';
import { AdminInput, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function ProgramEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<ProgramContent>(JSON.parse(JSON.stringify(content.program)));
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('program', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateDay = (index: number, day: ProgramDay) => {
    const days = [...data.days];
    days[index] = day;
    setData({ ...data, days });
  };

  const addDay = () => {
    setData({
      ...data,
      days: [...data.days, { day: data.days.length + 1, title: '', result: '', tool: '', format: '' }],
    });
  };

  const removeDay = (index: number) => {
    setData({ ...data, days: data.days.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <AdminSectionHeader title="Программа марафона" description="Подробная программа по дням" />
      <div className="space-y-4">
        <AdminInput label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <AdminInput label="Текст CTA" value={data.ctaText} onChange={(e) => setData({ ...data, ctaText: e.target.value })} />

        {data.days.map((day, i) => (
          <div key={i} className="card-glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-accent">День {day.day}</span>
              <button onClick={() => removeDay(i)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Удалить</button>
            </div>
            <AdminInput label="Тема дня" value={day.title} onChange={(e) => updateDay(i, { ...day, title: e.target.value })} />
            <AdminInput label="Результат" value={day.result} onChange={(e) => updateDay(i, { ...day, result: e.target.value })} />
            <AdminInput label="Инструменты" value={day.tool} onChange={(e) => updateDay(i, { ...day, tool: e.target.value })} />
            <AdminInput label="Формат" value={day.format} onChange={(e) => updateDay(i, { ...day, format: e.target.value })} />
          </div>
        ))}

        <button onClick={addDay} className="px-4 py-2 rounded-lg border border-dashed border-white/20 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
          + Добавить день
        </button>
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
