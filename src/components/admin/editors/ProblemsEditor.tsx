import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { ProblemsContent } from '../../../types/content';
import { AdminInput, AdminListEditor, AdminSectionHeader, AdminSaveButton, AdminTextarea } from '../AdminFormElements';

export function ProblemsEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<ProblemsContent>({ ...content.problems });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('problems', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminSectionHeader title="Проблемы ЦА" description="Блок, описывающий боли целевой аудитории" />
      <div className="space-y-4">
        <AdminInput label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <AdminListEditor label="Проблемы" items={data.problems} onChange={(problems) => setData({ ...data, problems })} />
        <AdminTextarea
          label="Решение"
          value={data.solutionText}
          onChange={(e) => setData({ ...data, solutionText: e.target.value })}
        />
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
