import { SectionWrapper } from '../shared/SectionWrapper';
import { useContent } from '../../context/ContentContext';

export function Testimonials() {
  const { content } = useContent();
  const { testimonials } = content;

  return (
    <SectionWrapper id='testimonials' className='bg-surface-light relative overflow-hidden'>
      <div className='max-w-4xl mx-auto relative z-10'>
        <h2 className='text-3xl md:text-5xl font-bold text-center mb-16'>
          {testimonials.title}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
             <div className='p-6 rounded-2xl bg-surface border border-white/5'>
               <h3 className='text-xl font-bold text-accent mb-2'>Система</h3>
               <p className='text-text-secondary'>Понимание системы и первые автоматизации</p>
             </div>
             <div className='p-6 rounded-2xl bg-surface border border-white/5'>
               <h3 className='text-xl font-bold text-neon-blue'>Инфраструктура</h3>
               <p className='text-text-secondary'>Базовая AI-инфраструктура и черновик лендинга</p>
             </div>
          </div>
          
          <div className='space-y-4 md:mt-12'>
             <div className='p-6 rounded-2xl bg-surface border border-white/5'>
               <h3 className='text-xl font-bold text-neon-green'>Контент и продажи</h3>
               <p className='text-text-secondary'>Контент на месяц, бот и аналитика</p>
             </div>
             
             <div className='p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 text-center'>
               <p className='text-2xl font-black text-white italic'>
                 «Это не теория.<br/>Это фундамент.»
               </p>
             </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}