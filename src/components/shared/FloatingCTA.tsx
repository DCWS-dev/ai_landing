import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function FloatingCTA() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
      <button
        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full bg-accent text-accent-text font-bold py-4 rounded-full text-lg shadow-soft hover:bg-accent-light transition-all cursor-pointer"
      >
        {t('ui.floatingCta')}
      </button>
    </div>
  );
}
