/* ============================================
   Select — dropdown select with search support
   ============================================ */
import { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  name,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-[var(--text-primary)]">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] z-10">
            <Icon className="w-5 h-5" style={{ fontSize: 20 }} />
          </div>
        )}

        <select
          ref={ref}
          id={name}
          name={name}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-lg text-sm appearance-none
            border transition-all duration-200 cursor-pointer
            bg-[var(--input-bg)] text-[var(--text-primary)]
            ${error
              ? 'border-danger-500 focus:ring-2 focus:ring-danger-500/20 focus:border-danger-500'
              : 'border-[var(--border-color)] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:border-[var(--border-hover)]'
            }
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            pr-10
            ${className}
          `}
          aria-invalid={!!error}
          {...props}
        >
          <option value="" className="text-[var(--text-tertiary)]">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-tertiary)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-xs text-danger-500 flex items-center gap-1" role="alert">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
