import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Custom nav labels would be better in translation file, but using existing keys for now to save time
  // Actually, let's just use manual labels mapping if we want specific short names, 
  // or keys like 'nav.program', etc. But I didn't add them. 
  // I will just use conditional logic or map to known keys. 
  // Let's use hardcoded strings based on language for now to be safe and quick.
  
  const links = [
    { label: i18n.language === 'uk' ? 'Програма' : 'Программа', href: '#program' },
    { label: i18n.language === 'uk' ? 'Тариф' : 'Тариф', href: '#pricing' },
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

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'uk' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav
      className={`fixed top-1 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-surface/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <a href="#hero" className="font-bold text-lg">
          <span className="gradient-text">AI</span>- перезагрузка
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm text-text-secondary hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-white transition-colors uppercase"
          >
            <Globe size={16} />
            {i18n.language}
          </button>

          <button
            onClick={() => handleNavClick('#pricing')}
            className="text-sm bg-accent text-surface font-bold px-4 py-2 rounded-lg hover:bg-accent-light transition-colors cursor-pointer"
          >
            {i18n.language === 'uk' ? 'Записатися' : 'Записаться'}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-4">
           <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-white transition-colors uppercase"
          >
            {i18n.language}
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
        <div className="md:hidden bg-surface/95 backdrop-blur-md border-b border-white/5 px-4 pb-4">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left py-3 text-text-secondary hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('#pricing')}
            className="w-full mt-2 bg-accent text-surface font-bold px-4 py-3 rounded-lg cursor-pointer"
          >
            {i18n.language === 'uk' ? 'Записатися' : 'Записаться'}
          </button>
        </div>
      )}
    </nav>
  );
}
