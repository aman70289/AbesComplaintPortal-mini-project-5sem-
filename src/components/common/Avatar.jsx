/* ============================================
   Avatar — user avatar with initials fallback
   ============================================ */
import { getInitials, stringToColor } from '@/utils/formatters';

const Avatar = ({ name, src, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-surface-800 ${className}`}
      />
    );
  }

  const bgColor = stringToColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-surface-800 shrink-0 ${className}`}
      style={{ backgroundColor: bgColor }}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
