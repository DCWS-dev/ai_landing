import { Rocket } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';

export function Upsell() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { upsell } = content;

  return (
    <SectionWrapper id="upsell" className="gradient-bg">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-6">
          <Rocket size={32} className="text-accent" />
        </div>

        <h2 className="text-2xl md:text-4xl font-bold mb-6">
          {upsell.title}
        </h2>

        <p className="text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
          {upsell.description}
        </p>

        <div className="card-glass rounded-2xl p-6 md:p-8 border-accent/20 border inline-block">
          <div className="text-lg font-semibold text-accent flex flex-wrap justify-center items-center gap-2">
            <span className="mr-1">🔥</span>
            <a 
              href={content.footer.privacyUrl}
              className="hover:underline cursor-pointer"
            >
              {t('privacyPolicy.title')}
            </a>
            <span className="text-accent/50">|</span>
            <a 
              href={content.footer.termsUrl}
              className="hover:underline cursor-pointer"
            >
              {t('termsOfService.title')}
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
