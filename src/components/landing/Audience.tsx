import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';

export function Audience() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { audience } = content;

  return (
    <SectionWrapper id="audience" className="bg-surface relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-16 right-8 w-80 h-80 bg-primary/4 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Case decoration */}
      <img
        src="/case.png"
        alt=""
        className="hidden md:block absolute right-0 top-1/3 w-32 lg:w-44 opacity-45 drop-shadow-lg animate-float animation-delay-2000 pointer-events-none z-0"
      />

      <h2 className="text-2xl md:text-4xl font-semibold text-left md:text-center mb-12 relative z-10">
        {audience.title}
      </h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {audience.cards.map((card, i) => (
          <div
            key={i}
            className="card-clean rounded-2xl p-6 md:p-8 hover:border-primary/40 transition-all group"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
              {card.role}
            </h3>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">{t('ui.audiencePains')}</p>
              <ul className="space-y-1">
                {card.pains.map((pain, j) => (
                  <li key={j} className="text-sm text-red-400 flex items-start gap-2">
                    <span className="mt-0.5">✕</span>
                    {pain}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">{t('ui.audienceResults')}</p>
              <ul className="space-y-1">
                {card.results.map((result, j) => (
                  <li key={j} className="text-sm text-green-500 flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
