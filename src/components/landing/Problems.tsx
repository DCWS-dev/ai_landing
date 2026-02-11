import { SectionWrapper } from '../shared/SectionWrapper';
import { useContent } from '../../context/ContentContext';
import { AlertCircle } from 'lucide-react';
import { Button } from '../shared/Button';

export function Problems() {
  const { content } = useContent();
  const { problems } = content;

  return (
    <SectionWrapper id='problems' className='bg-surface-light'>
      <div className='max-w-4xl mx-auto text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-400/10 text-red-400 mb-8'>
          <AlertCircle size={32} />
        </div>
        
        <h2 className='text-3xl md:text-5xl font-bold mb-8'>{problems.title}</h2>
        
        <div className='space-y-6 text-lg md:text-xl text-text-secondary leading-relaxed mb-12 max-w-2xl mx-auto'>
          {problems.problems.map((prob, i) => (
            <p key={i}>{prob}</p>
          ))}
        </div>

        <Button 
          size='lg' 
          className='text-xl px-12 py-6 shadow-glow'
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {problems.solutionText.replace('Твоё решение? ', '')}
        </Button>
      </div>
    </SectionWrapper>
  );
}