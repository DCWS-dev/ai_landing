import { SectionWrapper } from '../shared/SectionWrapper';
import { useTranslation } from 'react-i18next';
import { Button } from '../shared/Button';

export function Format() {
  const { t } = useTranslation();

  return (
    <SectionWrapper id='format' className='bg-surface-light relative overflow-hidden'>
      <div className='max-w-4xl mx-auto relative z-10'>
        <h2 className='text-3xl md:text-5xl font-semibold text-left md:text-center mb-16 leading-tight zigzag-lines'>
          <span>{t('ui.formatTitle1')}</span>
          <br />
          <span className='text-text-secondary'>{t('ui.formatTitle2')}</span>
        </h2>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8'>
          <Button
            variant='green'
            size='lg'
            className='w-full sm:w-auto px-12 py-5 text-xl uppercase tracking-wide'
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('ui.formatEarn')}
          </Button>

          <Button
            variant='outline'
            size='lg'
            className='w-full sm:w-auto px-12 py-5 text-xl uppercase tracking-wide opacity-50'
            onClick={() => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('ui.formatLose')}
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}