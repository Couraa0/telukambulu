import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex text-xs sm:text-sm text-slate-500 dark:text-slate-400 no-print mb-6 ${className}`}>
      <ol className="inline-flex items-center space-x-1.5 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
          >
            <Home size={14} />
            Beranda
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center">
              <ChevronRight size={14} className="text-slate-300 dark:text-slate-700 mx-1.5 flex-shrink-0" />
              {isLast || !item.path ? (
                <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[150px] sm:max-w-[300px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate max-w-[120px] sm:max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
