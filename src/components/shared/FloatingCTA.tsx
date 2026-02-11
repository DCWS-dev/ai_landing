import { useState, useEffect } from 'react';

export function FloatingCTA() {
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
        className="w-full bg-accent text-surface font-bold py-4 rounded-xl text-lg glow-accent hover:bg-accent-light transition-all cursor-pointer"
      >
        Записаться на марафон
      </button>
    </div>
  );
}
