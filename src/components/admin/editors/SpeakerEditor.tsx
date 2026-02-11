import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { SpeakerContent } from '../../../types/content';
import { AdminInput, AdminTextarea, AdminListEditor, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function SpeakerEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<SpeakerContent>({ ...content.speaker });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('speaker', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminSectionHeader title="Спикер / Автор" description="Информация о спикере марафона" />
      <div className="space-y-4">
        <AdminInput label="Имя" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        <AdminInput label="Роль / Должность" value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })} />
        <AdminInput label="URL фото" value={data.photoUrl} onChange={(e) => setData({ ...data, photoUrl: e.target.value })} placeholder="https://..." />
        <AdminListEditor label="Факты / Достижения" items={data.facts} onChange={(facts) => setData({ ...data, facts })} />
        <AdminTextarea label="Биография" value={data.bio} onChange={(e) => setData({ ...data, bio: e.target.value })} />
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
