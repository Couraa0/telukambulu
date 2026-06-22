import React, { ReactNode } from 'react';

export interface TableProps {
  headers: string[];
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  loading = false,
  empty = false,
  emptyMessage = 'Tidak ada data ditemukan.',
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto w-full border border-slate-100 dark:border-slate-800/80 rounded-2xl ${className}`}>
      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350">
          {loading ? (
            Array.from({ length: 3 }).map((_, rIdx) => (
              <tr key={rIdx} className="animate-pulse">
                {headers.map((_, hIdx) => (
                  <td key={hIdx} className="px-6 py-4">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : empty ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
