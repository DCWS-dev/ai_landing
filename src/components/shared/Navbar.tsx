import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Custom nav labels would be better in translation file, but using existing keys for now to save time
  // Actually, let's just use manual labels mapping if we want specific short names, 
  // or keys like 'nav.program', etc. But I didn't add them. 
  // I will just use conditional logic or map to known keys. 
  // Let's use hardcoded strings based on language for now to be safe and quick.
  
  const links = [
    { label: t('ui.navProgram'), href: '#program' },
    { label: t('ui.navPricing'), href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur-md border-b border-contrast/5 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <a href="#hero" className="font-bold text-lg text-text-primary">
          <span className="text-primary">AI</span>{t('ui.brand').replace('AI', '')}
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-primary hover:bg-contrast/5 transition-all"
            title={theme === 'dark' ? t('ui.themeLight') : t('ui.themeDark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => handleNavClick('#pricing')}
            className="text-sm bg-accent text-accent-text font-bold px-5 py-2 rounded-full hover:bg-accent-light transition-colors cursor-pointer"
          >
            {t('ui.navSignup')}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
           <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-primary transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-text-secondary cursor-pointer"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-md border-b border-contrast/5 px-4 pb-4">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left py-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('#pricing')}
            className="w-full mt-2 bg-accent text-accent-text font-bold px-4 py-3 rounded-full cursor-pointer"
          >
            {t('ui.navSignup')}
          </button>
        </div>
      )}
    </nav>
  );
}
