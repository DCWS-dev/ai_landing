import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'green';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...rest }: ButtonProps) {
  const base = 'font-bold rounded-full transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2';

  const variants: Record<string, string> = {
    primary: 'bg-accent text-accent-text hover:bg-accent-light shadow-soft hover:shadow-soft-lg hover:scale-[1.02]',
    secondary: 'bg-primary text-white hover:bg-primary-light shadow-soft hover:shadow-soft-lg hover:scale-[1.02]',
    outline: 'border-2 border-contrast/15 text-text-primary hover:border-primary hover:text-primary',
    green: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-soft hover:shadow-soft-lg hover:scale-[1.02]',
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
