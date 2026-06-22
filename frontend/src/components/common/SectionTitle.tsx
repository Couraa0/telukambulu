import React from 'react';

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'left',
  className = '',
}) => {
  return (
    <div className={`mb-8 sm:mb-12 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2.5 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className={`h-1.5 w-12 bg-primary-600 rounded-full mt-3.5 ${align === 'center' ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionTitle;
