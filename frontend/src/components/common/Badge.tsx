import React, { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'soft' | 'solid' | 'outline';
  type?: 'success' | 'info' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'soft',
  type = 'info',
  className = '',
}) => {
  const types = {
    success: {
      soft: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/30',
      solid: 'bg-emerald-600 text-white',
      outline: 'border border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500',
    },
    info: {
      soft: 'bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/30',
      solid: 'bg-sky-600 text-white',
      outline: 'border border-sky-600 text-sky-600 dark:text-sky-400 dark:border-sky-500',
    },
    warning: {
      soft: 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/30',
      solid: 'bg-amber-500 text-white',
      outline: 'border border-amber-500 text-amber-500 dark:text-amber-400 dark:border-amber-450',
    },
    danger: {
      soft: 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/30',
      solid: 'bg-rose-600 text-white',
      outline: 'border border-rose-600 text-rose-600 dark:text-rose-400 dark:border-rose-500',
    },
    neutral: {
      soft: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      solid: 'bg-slate-600 text-white',
      outline: 'border border-slate-600 text-slate-600 dark:text-slate-300 dark:border-slate-500',
    },
  };

  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold';

  return (
    <span className={`${baseStyles} ${types[type][variant]} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
