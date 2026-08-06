/* ============================================
   Badge — status & priority badges
   ============================================ */
import { COMPLAINT_STATUSES, PRIORITIES } from '@/utils/constants';

const Badge = ({ type = 'status', value, className = '', size = 'sm', dot = false }) => {
  let config;

  if (type === 'status') {
    config = COMPLAINT_STATUSES[value] || { label: value, bgClass: 'bg-surface-200 text-surface-700', darkBgClass: 'dark:bg-surface-700 dark:text-surface-300' };
  } else if (type === 'priority') {
    config = PRIORITIES[value] || { label: value, bgClass: 'bg-surface-200 text-surface-700' };
  } else {
    config = { label: value, bgClass: 'bg-primary-100 text-primary-800', darkBgClass: 'dark:bg-primary-900/30 dark:text-primary-300' };
  }

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${sizeClasses[size]}
        ${config.bgClass}
        ${config.darkBgClass || ''}
        ${className}
      `}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {config.label}
    </span>
  );
};

export default Badge;
