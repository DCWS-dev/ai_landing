import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...rest }: ButtonProps) {
  const base = 'font-bold rounded-xl transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2';

  const variants: Record<string, string> = {
    primary: 'bg-accent text-surface hover:bg-accent-light glow-accent hover:scale-105',
    secondary: 'bg-primary text-white hover:bg-primary-light glow-purple hover:scale-105',
    outline: 'border-2 border-primary text-primary-light hover:bg-primary hover:text-white',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
