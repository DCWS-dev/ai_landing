import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import type { TestimonialsContent, Testimonial } from '../../../types/content';
import { AdminInput, AdminTextarea, AdminSectionHeader, AdminSaveButton } from '../AdminFormElements';

export function TestimonialsEditor() {
  const { content, updateContent } = useContent();
  const [data, setData] = useState<TestimonialsContent>(JSON.parse(JSON.stringify(content.testimonials)));
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateContent('testimonials', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateTestimonial = (index: number, t: Testimonial) => {
    const testimonials = [...data.testimonials];
    testimonials[index] = t;
    setData({ ...data, testimonials });
  };

  const addTestimonial = () => {
    setData({ ...data, testimonials: [...data.testimonials, { name: '', role: '', text: '' }] });
  };

  const removeTestimonial = (index: number) => {
    setData({ ...data, testimonials: data.testimonials.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <AdminSectionHeader title="Отзывы" description="Отзывы участников марафона" />
      <div className="space-y-4">
        <AdminInput label="Заголовок" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <AdminInput label="Количество участников" value={data.participantCount} onChange={(e) => setData({ ...data, participantCount: e.target.value })} />

        {data.testimonials.map((t, i) => (
          <div key={i} className="card-clean rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">Отзыв {i + 1}</span>
              <button onClick={() => removeTestimonial(i)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Удалить</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="Имя" value={t.name} onChange={(e) => updateTestimonial(i, { ...t, name: e.target.value })} />
              <AdminInput label="Роль" value={t.role} onChange={(e) => updateTestimonial(i, { ...t, role: e.target.value })} />
            </div>
            <AdminTextarea label="Текст отзыва" value={t.text} onChange={(e) => updateTestimonial(i, { ...t, text: e.target.value })} />
          </div>
        ))}

        <button onClick={addTestimonial} className="px-4 py-2 rounded-lg border border-dashed border-contrast/20 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
          + Добавить отзыв
        </button>
      </div>
      <AdminSaveButton onClick={save} saved={saved} />
    </div>
  );
}
