import { SectionWrapper } from '../shared/SectionWrapper';
import { useContent } from '../../context/ContentContext';
import { X } from 'lucide-react';

export function Benefits() {
  const { content } = useContent();
  const { benefits } = content;

  return (
    <SectionWrapper id='benefits' className='bg-surface'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-3xl md:text-5xl font-bold text-center mb-16'>
          Давай честно:
          <br />
          <span className='text-indigo-400'>За 1 час ты можешь:</span>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div className='space-y-6'>
            {benefits.scenarios.slice(0, 3).map((item, i) => (
              <div key={i} className='flex gap-4 p-4 rounded-xl bg-red-400/5 text-text-secondary'>
                <X className='shrink-0 text-red-400' />
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className='relative'>
             <div className='absolute inset-0 bg-green-400/20 blur-3xl' />
             <div className='relative p-8 rounded-2xl bg-green-400/10 border border-green-400/20 text-center'>
               <h3 className='text-2xl font-bold text-green-400 mb-4'>ИЛИ</h3>
               <p className='text-xl text-white'>
                 {benefits.scenarios[3].replace('ИЛИ', '')}
               </p>
               <div className='mt-8 pt-6 border-t border-green-400/20 text-sm text-green-300'>
                 + понимание системы<br/>
                 + первые внедрения
               </div>
             </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}