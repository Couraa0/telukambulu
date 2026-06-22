import React, { ElementType } from 'react';
import Card from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  color?: 'primary' | 'secondary' | 'accent' | 'rose' | 'amber';
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  description,
  className = '',
}) => {
  const colorStyles = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-950/20',
      icon: 'text-primary-600 dark:text-primary-400',
    },
    secondary: {
      bg: 'bg-secondary-50 dark:bg-secondary-950/20',
      icon: 'text-secondary-600 dark:text-secondary-400',
    },
    accent: {
      bg: 'bg-accent-50 dark:bg-accent-950/20',
      icon: 'text-accent-600 dark:text-accent-400',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      icon: 'text-rose-600 dark:text-rose-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      icon: 'text-amber-600 dark:text-amber-400',
    },
  };

  return (
    <Card hoverEffect noPadding className={`flex items-center gap-3 p-3.5 sm:p-4 ${className}`}>
      <div className={`p-2.5 rounded-xl flex-shrink-0 ${colorStyles[color].bg}`}>
        <Icon size={20} className={colorStyles[color].icon} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-0.5 truncate">
          {title}
        </p>
        <h4 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white font-sans leading-none">
          {value}
        </h4>
        {description && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
