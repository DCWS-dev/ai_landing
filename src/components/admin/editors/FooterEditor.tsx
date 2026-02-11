import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { FooterContent } from '../../../types/content';
import { AdminInput, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function FooterEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<FooterContent>({ ...content.footer });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('footer', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminSectionHeader title="Footer" description="Подвал сайта — ссылки и контакты" />
      <div className="space-y-4">
        <AdminInput label="Текст CTA" value={data.ctaText} onChange={(e) => setData({ ...data, ctaText: e.target.value })} />
        <AdminInput label="Telegram URL" value={data.telegramUrl} onChange={(e) => setData({ ...data, telegramUrl: e.target.value })} />
        <AdminInput label="YouTube URL" value={data.youtubeUrl} onChange={(e) => setData({ ...data, youtubeUrl: e.target.value })} />
        <AdminInput label="Политика конфиденциальности URL" value={data.privacyUrl} onChange={(e) => setData({ ...data, privacyUrl: e.target.value })} />
        <AdminInput label="Оферта URL" value={data.termsUrl} onChange={(e) => setData({ ...data, termsUrl: e.target.value })} />
        <AdminInput label="Копирайт" value={data.copyright} onChange={(e) => setData({ ...data, copyright: e.target.value })} />
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
