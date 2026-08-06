/* ============================================
   Input — reusable form input with label, error, icons
   Supports text, email, password (show/hide), textarea
   ============================================ */
import { forwardRef, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  helperText,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  textarea = false,
  rows = 4,
  maxLength,
  currentLength,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputClasses = `
    w-full px-4 py-2.5 rounded-lg text-sm
    border transition-all duration-200
    bg-[var(--input-bg)] text-[var(--text-primary)]
    placeholder:text-[var(--text-tertiary)]
    ${error
      ? 'border-danger-500 focus:ring-2 focus:ring-danger-500/20 focus:border-danger-500'
      : 'border-[var(--border-color)] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:border-[var(--border-hover)]'
    }
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
    ${Icon ? 'pl-10' : ''}
    ${isPassword ? 'pr-10' : ''}
    ${className}
  `;

  const InputTag = textarea ? 'textarea' : 'input';

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[var(--text-primary)]"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
            <Icon className="w-5 h-5" style={{ fontSize: 20 }} />
          </div>
        )}

        <InputTag
          ref={ref}
          id={name}
          name={name}
          type={textarea ? undefined : inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          rows={textarea ? rows : undefined}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <VisibilityOffIcon style={{ fontSize: 20 }} />
            ) : (
              <VisibilityIcon style={{ fontSize: 20 }} />
            )}
          </button>
        )}
      </div>

      {/* Character counter for textareas */}
      {maxLength && currentLength !== undefined && (
        <div className="flex justify-end">
          <span className={`text-xs ${currentLength > maxLength * 0.9 ? 'text-danger-500' : 'text-[var(--text-tertiary)]'}`}>
            {currentLength}/{maxLength}
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p id={`${name}-error`} className="text-xs text-danger-500 flex items-center gap-1" role="alert">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p id={`${name}-helper`} className="text-xs text-[var(--text-tertiary)]">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
