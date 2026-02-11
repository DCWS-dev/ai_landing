import { useTranslation } from 'react-i18next';
import { Button } from '../components/shared/Button';
import { useNavigate } from 'react-router-dom';

interface PolicySection {
  title: string;
  content: string;
}

export function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sections = t('privacyPolicy.sections', { returnObjects: true }) as PolicySection[];

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          ← {t('privacyPolicy.backButton', 'Назад на главную')}
        </Button>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('privacyPolicy.title')}
          </h1>
          
          <p className="text-text-muted mb-8">
             {t('privacyPolicy.lastUpdated', 'Последнее обновление')}: {t('privacyPolicy.date')}
          </p>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <div className="whitespace-pre-wrap">{t('privacyPolicy.intro')}</div>

            {Array.isArray(sections) && sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  {section.title}
                </h2>
                <div className="whitespace-pre-wrap">{section.content}</div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
