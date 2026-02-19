import { SectionWrapper } from '../shared/SectionWrapper';
import { useContent } from '../../context/ContentContext';
import { AlertCircle } from 'lucide-react';
import { Button } from '../shared/Button';

export function Problems() {
  const { content } = useContent();
  const { problems } = content;

  return (
    <SectionWrapper id='problems' className='bg-surface relative overflow-hidden'>
      {/* Background blobs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-8 w-72 h-72 bg-red-400/5 rounded-full blur-3xl animate-blob' />
        <div className='absolute bottom-16 left-10 w-64 h-64 bg-primary/4 rounded-full blur-3xl animate-blob animation-delay-4000' />
      </div>

      <div className='max-w-4xl mx-auto text-left md:text-center relative z-10'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-400 mb-8'>
          <AlertCircle size={32} />
        </div>
        
        <h2 className='text-3xl md:text-5xl font-semibold mb-8'>{problems.title}</h2>
        
        <div className='space-y-6 text-lg md:text-xl text-text-secondary leading-relaxed mb-12 max-w-2xl mx-auto'>
          {problems.problems.map((prob, i) => (
            <p key={i}>{prob}</p>
          ))}
        </div>

        <div className='text-center'>
        <Button 
          size='lg' 
          className='text-xl px-12 py-6 shadow-soft-lg'
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {problems.solutionText}
        </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}