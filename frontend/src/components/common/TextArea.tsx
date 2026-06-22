import React, { type TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  name,
  className = '',
  required,
  rows = 4,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        id={name}
        rows={rows}
        className={`w-full text-sm rounded-xl border transition-all duration-200 bg-white dark:bg-slate-900/50 py-2.5 px-4 focus:outline-none focus:ring-4 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-200 dark:border-slate-800/80 focus:border-primary-500 focus:ring-primary-500/20'
        }`}
        required={required}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export default TextArea;
