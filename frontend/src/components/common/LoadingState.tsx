import React from 'react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Memuat data...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Spinner rings */}
        <div className="w-10 h-10 border-4 border-primary-200 dark:border-primary-900/30 rounded-full"></div>
        <div className="absolute w-10 h-10 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
};

export default LoadingState;
