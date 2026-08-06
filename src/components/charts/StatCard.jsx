/* ============================================
   Chart Components — stat cards and wrappers
   ============================================ */
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  delay = 0,
  className = '',
}) => {
  const colorMap = {
    primary: { bg: 'bg-primary-600/10 dark:bg-primary-500/20', text: 'text-primary-600 dark:text-primary-400', icon: 'text-primary-600' },
    success: { bg: 'bg-success-500/10 dark:bg-success-500/20', text: 'text-success-600 dark:text-success-400', icon: 'text-success-500' },
    danger: { bg: 'bg-danger-500/10 dark:bg-danger-500/20', text: 'text-danger-600 dark:text-danger-400', icon: 'text-danger-500' },
    accent: { bg: 'bg-accent-500/10 dark:bg-accent-500/20', text: 'text-accent-600 dark:text-accent-400', icon: 'text-accent-500' },
    warning: { bg: 'bg-warning-500/10 dark:bg-warning-500/20', text: 'text-warning-600 dark:text-warning-400', icon: 'text-warning-500' },
    indigo: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', icon: 'text-indigo-500' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={`card-base p-5 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
            <Icon className={c.icon} style={{ fontSize: 22 }} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay * 0.1 + 0.2 }}
            className="text-2xl font-bold text-[var(--text-primary)]"
          >
            {value}
          </motion.p>
        </div>

        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-success-500' : 'text-danger-500'}`}>
            {trend === 'up' ? <TrendingUpIcon style={{ fontSize: 16 }} /> : <TrendingDownIcon style={{ fontSize: 16 }} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
