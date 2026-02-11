import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { UpsellContent } from '../../../types/content';
import { AdminInput, AdminTextarea, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function UpsellEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<UpsellContent>({ ...content.upsell });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('upsell', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminSectionHeader title="Апселл (курс «Масштаб»)" description="Прогрев к полному курсу" />
      <div className="space-y-4">
        <AdminInput label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <AdminTextarea label="Описание" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
        <AdminInput label="Текст скидки" value={data.discount} onChange={(e) => setData({ ...data, discount: e.target.value })} />
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
