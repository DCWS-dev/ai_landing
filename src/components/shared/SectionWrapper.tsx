import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`py-16 md:py-24 px-4 md:px-8 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </motion.section>
  );
}
