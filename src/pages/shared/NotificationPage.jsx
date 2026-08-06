/* ============================================
   NotificationPage — unread/read notifications
   ============================================ */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/context/NotificationContext';
import { timeAgo } from '@/utils/formatters';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';

import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/WarningAmber';
import CampaignIcon from '@mui/icons-material/Campaign';
import CommentIcon from '@mui/icons-material/Comment';
import CircleIcon from '@mui/icons-material/Circle';

const typeIcons = {
  status_update: InfoIcon,
  comment: CommentIcon,
  resolved: CheckCircleIcon,
  rejected: WarningIcon,
  announcement: CampaignIcon,
  system: NotificationsIcon,
};

const typeColors = {
  status_update: 'text-primary-500 bg-primary-500/10',
  comment: 'text-indigo-500 bg-indigo-500/10',
  resolved: 'text-success-500 bg-success-500/10',
  rejected: 'text-danger-500 bg-danger-500/10',
  announcement: 'text-accent-500 bg-accent-500/10',
  system: 'text-surface-500 bg-surface-500/10',
};

const NotificationPage = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notifications</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" icon={DoneAllIcon} size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon={NotificationsIcon} title="No Notifications" description={`You have no ${filter === 'all' ? '' : filter} notifications.`} />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((notif) => {
              const Icon = typeIcons[notif.type] || NotificationsIcon;
              const color = typeColors[notif.type] || typeColors.system;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                >
                  <Card
                    padding="p-4"
                    className={`${!notif.read ? 'border-l-4 border-l-primary-500' : ''}`}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.complaintId) navigate(`/student/complaints/${notif.complaintId}`);
                    }}
                    hover
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                        <Icon style={{ fontSize: 18 }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-[var(--text-primary)]">{notif.title}</h4>
                              {!notif.read && <CircleIcon className="text-primary-500" style={{ fontSize: 8 }} />}
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{notif.message}</p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">{timeAgo(notif.createdAt)}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                            className="p-1 rounded-lg hover:bg-danger-500/10 text-[var(--text-tertiary)] hover:text-danger-500 transition-colors shrink-0"
                          >
                            <DeleteIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
