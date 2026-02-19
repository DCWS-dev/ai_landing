import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { FileText, Shield } from 'lucide-react';

export function Upsell() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { upsell } = content;

  return (
    <SectionWrapper id="upsell" className="bg-surface">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-semibold mb-4">
          {upsell.title}
        </h2>
        <p className="text-text-secondary mb-8">{upsell.description}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={content.footer.privacyUrl}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-contrast/15 text-text-primary hover:border-primary hover:text-primary transition-all text-sm font-semibold"
          >
            <Shield size={16} />
            {t('privacyPolicy.title')}
          </a>
          <a
            href={content.footer.termsUrl}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-contrast/15 text-text-primary hover:border-primary hover:text-primary transition-all text-sm font-semibold"
          >
            <FileText size={16} />
            {t('termsOfService.title')}
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
