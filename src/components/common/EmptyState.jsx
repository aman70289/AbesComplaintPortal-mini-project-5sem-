/* ============================================
   EmptyState — illustrated empty/no-data state
   ============================================ */
import { motion } from 'framer-motion';
import InboxIcon from '@mui/icons-material/Inbox';
import Button from './Button';

const EmptyState = ({
  icon: Icon = InboxIcon,
  title = 'No Data Found',
  description = 'There is nothing to display at the moment.',
  actionLabel,
  onAction,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
  >
    <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
      <Icon style={{ fontSize: 40 }} className="text-[var(--text-tertiary)]" />
    </div>
    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
    <p className="text-sm text-[var(--text-secondary)] max-w-md mb-6">{description}</p>
    {actionLabel && onAction && (
      <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
    )}
  </motion.div>
);

export default EmptyState;
