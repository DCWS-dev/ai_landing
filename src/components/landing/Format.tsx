import { SectionWrapper } from '../shared/SectionWrapper';
import { useTranslation } from 'react-i18next';
import { Button } from '../shared/Button';

export function Format() {
  const { t } = useTranslation();

  return (
    <SectionWrapper id='format' className='bg-surface relative overflow-hidden'>
      {/* Background blobs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-16 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-2000' />
        <div className='absolute bottom-16 right-16 w-72 h-72 bg-primary/4 rounded-full blur-3xl animate-blob animation-delay-4000' />
      </div>

      {/* Clock decoration — left aligned */}
      <img
        src='/clock.png'
        alt=''
        className='hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-28 lg:w-36 opacity-50 drop-shadow-lg animate-float pointer-events-none z-0'
      />

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