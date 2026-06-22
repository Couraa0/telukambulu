import React from 'react';

export interface SkeletonProps {
  variant?: 'card' | 'list' | 'text' | 'image' | 'news-card' | 'product-card' | 'wisata-card' | 'announcement';
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  className = '',
  count = 1,
}) => {
  const items = Array.from({ length: count });

  const renderSkeleton = () => {
    switch (variant) {
      case 'news-card':
        return (
          <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 w-full bg-slate-200 dark:bg-emerald-950/20" />
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="h-3 w-1/4 bg-slate-200 dark:bg-emerald-950/25 rounded-full mb-3" />
                <div className="h-5 w-11/12 bg-slate-200 dark:bg-emerald-950/25 rounded mb-2" />
                <div className="h-5 w-4/5 bg-slate-200 dark:bg-emerald-950/25 rounded mb-4" />
                <div className="h-3 w-full bg-slate-200 dark:bg-emerald-950/25 rounded mb-2" />
                <div className="h-3 w-5/6 bg-slate-200 dark:bg-emerald-950/25 rounded" />
              </div>
              <div className="h-4 w-1/3 bg-slate-200 dark:bg-emerald-950/25 rounded-full mt-4" />
            </div>
          </div>
        );
      case 'product-card':
        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
            <div className="h-48 w-full bg-slate-200 dark:bg-emerald-950/20" />
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="h-3 w-1/3 bg-slate-200 dark:bg-emerald-950/25 rounded-full mb-3" />
                <div className="h-5 w-10/12 bg-slate-200 dark:bg-emerald-950/25 rounded mb-2" />
                <div className="h-3.5 w-full bg-slate-200 dark:bg-emerald-950/25 rounded mb-1" />
                <div className="h-3.5 w-4/5 bg-slate-200 dark:bg-emerald-950/25 rounded" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-5 w-1/3 bg-slate-200 dark:bg-emerald-950/25 rounded" />
                <div className="h-8 w-24 bg-slate-200 dark:bg-emerald-950/25 rounded-lg" />
              </div>
            </div>
          </div>
        );
      case 'wisata-card':
        return (
          <div className="h-72 w-full bg-slate-200 dark:bg-emerald-950/20 rounded-2xl animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 space-y-3">
              <div className="h-4 w-1/3 bg-white/20 dark:bg-emerald-900/30 rounded-full" />
              <div className="h-6 w-3/4 bg-white/30 dark:bg-emerald-850/40 rounded" />
              <div className="h-4 w-1/2 bg-white/20 dark:bg-emerald-900/30 rounded" />
            </div>
          </div>
        );
      case 'announcement':
        return (
          <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-emerald-950/25 flex-shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-20 bg-slate-200 dark:bg-emerald-950/25 rounded-full" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-emerald-950/25 rounded-full" />
              </div>
              <div className="h-4.5 w-10/12 bg-slate-200 dark:bg-emerald-950/25 rounded" />
              <div className="h-3 w-full bg-slate-200 dark:bg-emerald-950/25 rounded" />
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 w-full bg-slate-200 dark:bg-emerald-950/25 rounded-xl" />
            <div className="h-12 w-full bg-slate-200 dark:bg-emerald-950/25 rounded-xl" />
            <div className="h-12 w-full bg-slate-200 dark:bg-emerald-950/25 rounded-xl" />
          </div>
        );
      case 'image':
        return <div className={`bg-slate-200 dark:bg-emerald-950/20 animate-pulse rounded-2xl ${className}`} />;
      case 'card':
        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-slate-200 dark:bg-emerald-950/20" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-emerald-950/25 rounded" />
              <div className="h-3.5 w-full bg-slate-200 dark:bg-emerald-950/25 rounded" />
              <div className="h-3.5 w-4/5 bg-slate-200 dark:bg-emerald-950/25 rounded" />
            </div>
          </div>
        );
      case 'text':
      default:
        return (
          <div className="space-y-3.5 animate-pulse">
            <div className="h-4.5 w-full bg-slate-200 dark:bg-emerald-950/25 rounded" />
            <div className="h-4.5 w-5/6 bg-slate-200 dark:bg-emerald-950/25 rounded" />
            <div className="h-4.5 w-2/3 bg-slate-200 dark:bg-emerald-950/25 rounded" />
            <div className="h-4.5 w-3/4 bg-slate-200 dark:bg-emerald-950/25 rounded" />
          </div>
        );
    }
  };

  return (
    <>
      {items.map((_, idx) => (
        <React.Fragment key={idx}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default Skeleton;
