import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { FAQContent, FAQItem } from '../../../types/content';
import { AdminInput, AdminTextarea, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function FAQEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<FAQContent>(JSON.parse(JSON.stringify(content.faq)));
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('faq', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateItem = (index: number, item: FAQItem) => {
    const items = [...data.items];
    items[index] = item;
    setData({ ...data, items });
  };

  const addItem = () => {
    setData({ ...data, items: [...data.items, { question: '', answer: '' }] });
  };

  const removeItem = (index: number) => {
    setData({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <AdminSectionHeader title="FAQ" description="Часто задаваемые вопросы" />
      <div className="space-y-4">
        <AdminInput label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />

        {data.items.map((item, i) => (
          <div key={i} className="card-clean rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">Вопрос {i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Удалить</button>
            </div>
            <AdminInput label="Вопрос" value={item.question} onChange={(e) => updateItem(i, { ...item, question: e.target.value })} />
            <AdminTextarea label="Ответ" value={item.answer} onChange={(e) => updateItem(i, { ...item, answer: e.target.value })} />
          </div>
        ))}

        <button onClick={addItem} className="px-4 py-2 rounded-lg border border-dashed border-contrast/20 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
          + Добавить вопрос
        </button>
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
