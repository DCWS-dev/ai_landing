import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Type, AlertCircle, Users, Calendar,
  BookOpen, BarChart3, Mic2, MessageSquare, CreditCard,
  HelpCircle, Rocket, Link2, Settings, ArrowLeft, Menu, X,
  Database, LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const sidebarSections = [
  { id: 'hero', label: 'Hero / Шапка', icon: Type },
  { id: 'problems', label: 'Проблемы ЦА', icon: AlertCircle },
  { id: 'audience', label: 'Аудитория', icon: Users },
  { id: 'format', label: 'Формат', icon: Calendar },
  { id: 'program', label: 'Программа', icon: BookOpen },
  { id: 'benefits', label: 'Выгоды', icon: BarChart3 },
  { id: 'speaker', label: 'Спикер', icon: Mic2 },
  { id: 'testimonials', label: 'Отзывы', icon: MessageSquare },
  { id: 'pricing', label: 'Тариф и оплата', icon: CreditCard },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'upsell', label: 'Апселл', icon: Rocket },
  { id: 'footer', label: 'Footer', icon: Link2 },
  { id: 'users', label: 'Пользователи (БД)', icon: Database },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const currentSection = location.pathname.replace('/admin/', '').replace('/admin', '');

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-light border-r border-white/5 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:shrink-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={20} className="text-accent" />
            <span className="font-bold">Админ-панель</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-muted cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {sidebarSections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => {
                  navigate(`/admin/${section.id}`);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary/20 text-accent border border-primary/30'
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {section.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} />
            Вернуться на сайт
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-white/5 px-4 md:px-6 h-14 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-text-muted cursor-pointer">
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
            <Settings size={16} />
            Управление контентом
          </h1>
        </header>

        <main className="p-4 md:p-6 lg:p-8 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
