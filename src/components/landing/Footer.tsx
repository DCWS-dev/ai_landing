import { Send, Youtube } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../shared/Button';

export function Footer() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { footer } = content;

  return (
    <footer className="bg-surface-light border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Готов начать свою <span className="gradient-text">ИИ-перезагрузку</span>?
          </h2>
          <Button
            variant="primary"
            size="lg"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {footer.ctaText}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          <a
            href={footer.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
          >
            <Send size={18} />
            Telegram
          </a>
          <a
            href={footer.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
          >
            <Youtube size={18} />
            YouTube
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted mb-4">
          <a href={footer.privacyUrl} className="hover:text-text-secondary transition-colors">
            {t('privacyPolicy.title')}
          </a>
          <span>•</span>
          <a href={footer.termsUrl} className="hover:text-text-secondary transition-colors">
            {t('termsOfService.title')}
          </a>
        </div>

        <p className="text-center text-xs text-text-muted">{footer.copyright}</p>
      </div>
    </footer>
  );
}
