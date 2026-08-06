/* ============================================
   Card — reusable card container
   ============================================ */
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  variant = 'default', // default, glass, interactive, gradient
  padding = 'p-6',
  hover = false,
  onClick,
  animate = true,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--shadow-card)]',
    glass: 'glass-strong',
    interactive: 'card-interactive',
    gradient: 'gradient-primary text-white border-none',
    flat: 'bg-[var(--bg-card)]',
  };

  const Component = animate ? motion.div : 'div';
  const animateProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  } : {};

  return (
    <Component
      className={`
        rounded-xl ${padding}
        ${variantClasses[variant]}
        ${hover ? 'hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...animateProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
