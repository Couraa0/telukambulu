import React, { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noPadding?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  noPadding = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm ${
        hoverEffect ? 'hover-lift cursor-pointer' : ''
      } ${noPadding ? '' : 'p-5 sm:p-6'} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;
