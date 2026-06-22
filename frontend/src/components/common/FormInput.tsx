import React, { InputHTMLAttributes, ElementType } from 'react';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ElementType;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  name,
  type = 'text',
  icon: Icon,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          className={`w-full text-sm rounded-xl border transition-all duration-200 bg-white dark:bg-slate-900/50 py-2.5 ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-4 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-800/80 focus:border-primary-500 focus:ring-primary-500/20'
          } focus:outline-none focus:ring-4`}
          required={required}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export default FormInput;
