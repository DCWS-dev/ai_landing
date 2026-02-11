import { SectionWrapper } from '../shared/SectionWrapper';
import { motion } from 'framer-motion';

export function Format() {
  return (
    <SectionWrapper id='format' className='bg-surface relative overflow-hidden'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]' />
      
      <div className='max-w-4xl mx-auto text-center relative z-10'>
        <h2 className='text-3xl md:text-5xl font-bold mb-16 leading-tight'>
          Перестрой свой бизнес в доходный конвейер
          <br />
          <span className='text-text-secondary'>или уступи тем, кто это уже сделал!</span>
        </h2>

        <div className='flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='w-full md:w-auto px-12 py-6 rounded-2xl bg-gradient-to-r from-accent to-accent-light text-surface text-xl font-bold shadow-glow hover:shadow-glow-lg transition-all'
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Заработать
          </motion.button>

          <div className='text-2xl font-black text-white/20'>ИЛИ</div>

          <button
            disabled
            className='w-full md:w-auto px-12 py-6 rounded-2xl bg-white/5 text-text-muted text-xl font-medium border border-white/5 cursor-not-allowed contrast-50 grayscale'
          >
            Уступить
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}