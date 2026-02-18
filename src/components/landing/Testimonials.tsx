import { SectionWrapper } from '../shared/SectionWrapper';
import { useContent } from '../../context/ContentContext';
import { useTranslation } from 'react-i18next';

export function Testimonials() {
  const { content } = useContent();
  const { t } = useTranslation();
  const { testimonials } = content;

  return (
    <SectionWrapper id='testimonials' className='bg-surface relative overflow-hidden'>
      <div className='max-w-4xl mx-auto relative z-10'>
        <h2 className='text-3xl md:text-5xl font-semibold text-left md:text-center mb-16'>
          {testimonials.title}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
             <div className='p-6 rounded-2xl bg-surface-light border border-contrast/5'>
               <h3 className='text-xl font-bold text-primary mb-2'>{t('ui.testimonialsSystem')}</h3>
               <p className='text-text-secondary'>{t('ui.testimonialsSystemDesc')}</p>
             </div>
             <div className='p-6 rounded-2xl bg-surface-light border border-contrast/5'>
               <h3 className='text-xl font-bold text-primary'>{t('ui.testimonialsInfra')}</h3>
               <p className='text-text-secondary'>{t('ui.testimonialsInfraDesc')}</p>
             </div>
          </div>
          
          <div className='space-y-4 md:mt-12'>
             <div className='p-6 rounded-2xl bg-surface-light border border-contrast/5'>
               <h3 className='text-xl font-bold text-green-500'>{t('ui.testimonialsContent')}</h3>
               <p className='text-text-secondary'>{t('ui.testimonialsContentDesc')}</p>
             </div>
             
             <div className='p-8 rounded-2xl bg-primary/5 border border-primary/15 text-left md:text-center'>
               <p className='text-2xl font-black text-text-primary italic whitespace-pre-line'>
                 {t('ui.testimonialsQuote')}
               </p>
             </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}