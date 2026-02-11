import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { PricingContent } from '../../../types/content';
import { AdminInput, AdminListEditor, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function PricingEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<PricingContent>({ ...content.pricing });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('pricing', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminSectionHeader title="Тариф и оплата" description="Настройки блока с ценой и оплатой" />
      <div className="space-y-4">
        <AdminInput label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <AdminInput label="Цена" value={data.price} onChange={(e) => setData({ ...data, price: e.target.value })} />
        <AdminInput label="Текст CTA" value={data.ctaText} onChange={(e) => setData({ ...data, ctaText: e.target.value })} />
        <AdminListEditor label="Включено в тариф" items={data.features} onChange={(features) => setData({ ...data, features })} />
        <AdminListEditor label="Бонусы" items={data.bonuses} onChange={(bonuses) => setData({ ...data, bonuses })} />
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
