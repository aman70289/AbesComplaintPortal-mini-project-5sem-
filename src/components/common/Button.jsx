/* ============================================
   Button — primary reusable button component
   Variants: primary, secondary, outline, danger, ghost, accent
   Sizes: sm, md, lg
   ============================================ */
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary-800 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-sm hover:shadow-md',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400 dark:hover:text-white',
  danger: 'bg-danger-500 hover:bg-danger-600 text-white shadow-sm',
  ghost: 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700',
  accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-sm',
  success: 'bg-success-500 hover:bg-success-600 text-white shadow-sm',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-2.5 text-base rounded-xl',
  xl: 'px-8 py-3 text-lg rounded-xl',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
