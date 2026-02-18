import { SectionWrapper } from '../shared/SectionWrapper';
import { useContent } from '../../context/ContentContext';
import { AlertCircle } from 'lucide-react';
import { Button } from '../shared/Button';

export function Problems() {
  const { content } = useContent();
  const { problems } = content;

  return (
    <SectionWrapper id='problems' className='bg-surface-light'>
      <div className='max-w-4xl mx-auto text-left md:text-center'>
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