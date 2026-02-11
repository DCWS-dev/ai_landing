import { useNavigate } from 'react-router-dom';
import {
  Type, AlertCircle, Users, Calendar, BookOpen, BarChart3,
  Mic2, MessageSquare, CreditCard, HelpCircle, Rocket, Link2,
  RotateCcw, Eye, Database,
} from 'lucide-react';

const sections = [
  { id: 'hero', label: 'Hero / Шапка', icon: Type, color: 'text-yellow-400' },
  { id: 'problems', label: 'Проблемы ЦА', icon: AlertCircle, color: 'text-red-400' },
  { id: 'audience', label: 'Аудитория', icon: Users, color: 'text-blue-400' },
  { id: 'format', label: 'Формат', icon: Calendar, color: 'text-green-400' },
  { id: 'program', label: 'Программа', icon: BookOpen, color: 'text-purple-400' },
  { id: 'benefits', label: 'Выгоды', icon: BarChart3, color: 'text-cyan-400' },
  { id: 'speaker', label: 'Спикер', icon: Mic2, color: 'text-orange-400' },
  { id: 'testimonials', label: 'Отзывы', icon: MessageSquare, color: 'text-pink-400' },
  { id: 'pricing', label: 'Тариф и оплата', icon: CreditCard, color: 'text-emerald-400' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'text-indigo-400' },
  { id: 'upsell', label: 'Апселл', icon: Rocket, color: 'text-amber-400' },
  { id: 'footer', label: 'Footer', icon: Link2, color: 'text-slate-400' },
  { id: 'users', label: 'Пользователи (БД)', icon: Database, color: 'text-teal-400' },
];

interface AdminDashboardProps {
  onReset: () => void;
}

export function AdminDashboard({ onReset }: AdminDashboardProps) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Панель управления</h2>
        <p className="text-text-secondary text-sm">
          Выберите секцию лендинга для редактирования. Все изменения сохраняются в localStorage и применяются мгновенно.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-sm text-primary-light hover:bg-primary/30 transition-colors"
        >
          <Eye size={16} />
          Открыть лендинг
        </a>
        <button
          onClick={() => {
            if (window.confirm('Сбросить все изменения к значениям по умолчанию?')) {
              onReset();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-sm text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
        >
          <RotateCcw size={16} />
          Сбросить контент
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => navigate(`/admin/${section.id}`)}
              className="card-glass rounded-xl p-4 text-left hover:border-primary/30 transition-all group cursor-pointer"
            >
              <Icon size={24} className={`${section.color} mb-2 group-hover:scale-110 transition-transform`} />
              <p className="text-sm font-semibold">{section.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
