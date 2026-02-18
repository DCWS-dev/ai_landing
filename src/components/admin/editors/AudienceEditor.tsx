import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { AudienceContent, AudienceCard } from '../../../types/content';
import { AdminInput, AdminListEditor, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function AudienceEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<AudienceContent>(JSON.parse(JSON.stringify(content.audience)));
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('audience', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCard = (index: number, card: AudienceCard) => {
    const cards = [...data.cards];
    cards[index] = card;
    setData({ ...data, cards });
  };

  const addCard = () => {
    setData({
      ...data,
      cards: [...data.cards, { role: '', icon: '📌', pains: [''], results: [''] }],
    });
  };

  const removeCard = (index: number) => {
    setData({ ...data, cards: data.cards.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <AdminSectionHeader title="Аудитория" description="Карточки целевой аудитории" />
      <div className="space-y-4">
        <AdminInput label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />

        {data.cards.map((card, i) => (
          <div key={i} className="card-clean rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">Карточка {i + 1}</span>
              <button onClick={() => removeCard(i)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Удалить</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="Роль" value={card.role} onChange={(e) => updateCard(i, { ...card, role: e.target.value })} />
              <AdminInput label="Иконка (emoji)" value={card.icon} onChange={(e) => updateCard(i, { ...card, icon: e.target.value })} />
            </div>
            <AdminListEditor label="Боли" items={card.pains} onChange={(pains) => updateCard(i, { ...card, pains })} />
            <AdminListEditor label="Результаты" items={card.results} onChange={(results) => updateCard(i, { ...card, results })} />
          </div>
        ))}

        <button onClick={addCard} className="px-4 py-2 rounded-lg border border-dashed border-contrast/20 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
          + Добавить карточку
        </button>
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
