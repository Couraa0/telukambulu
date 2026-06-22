import React, { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (SelectOption | string)[];
  error?: string;
  placeholder?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  error,
  name,
  className = '',
  required,
  placeholder,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        name={name}
        id={name}
        className={`w-full text-sm rounded-xl border transition-all duration-200 bg-white dark:bg-slate-900/50 py-2.5 px-4 focus:outline-none focus:ring-4 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-200 dark:border-slate-800/80 focus:border-primary-500 focus:ring-primary-500/20'
        }`}
        required={required}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, idx) => {
          const isObj = typeof option === 'object';
          const val = isObj ? option.value : option;
          const lbl = isObj ? option.label : option;
          return (
            <option key={idx} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export default SelectInput;
