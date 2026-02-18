import { Send, Youtube } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { footer } = content;

  return (
    <footer className="bg-accent text-accent-text">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Top row: logo & tagline */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-1">
            <span className="text-primary">AI</span>{t('ui.brand').replace('AI', '')}
          </h3>
          <p className="text-sm opacity-70">
            {t('ui.footerTagline')}
          </p>
        </div>

        {/* Legal links row */}
        <div className="flex flex-wrap items-center gap-4 text-xs opacity-60 mb-6">
          <a href={footer.privacyUrl} className="hover:opacity-100 transition-opacity">
            {t('privacyPolicy.title')}
          </a>
          <a href={footer.termsUrl} className="hover:opacity-100 transition-opacity">
            {t('termsOfService.title')}
          </a>
          <a
            href={footer.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <Send size={12} /> Telegram
          </a>
          <a
            href={footer.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <Youtube size={12} /> YouTube
          </a>
        </div>

        <div className="border-t border-accent-text/10 pt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs opacity-50">{footer.copyright}</p>
          {/* Payment logos placeholder */}
          <div className="flex items-center gap-3 opacity-40 text-xs">
            <span>💳 VISA</span>
            <span>•</span>
            <span>MasterCard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
