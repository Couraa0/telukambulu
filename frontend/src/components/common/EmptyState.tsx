import React, { ElementType } from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ElementType;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak ada data',
  description = 'Data yang Anda cari tidak tersedia atau belum ditambahkan.',
  icon: Icon = Inbox,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/10 ${className}`}>
      <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-1.5 font-sans">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
