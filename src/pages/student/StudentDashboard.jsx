/* ============================================
   StudentDashboard — main student landing page
   ============================================ */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getComplaints } from '@/services/complaintService';
import { mockAnnouncements, mockEvents, studentStats } from '@/services/mockData';
import { ROUTES } from '@/utils/constants';
import { formatDate, timeAgo } from '@/utils/formatters';
import StatCard from '@/components/charts/StatCard';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { DashboardSkeleton } from '@/components/common/SkeletonLoader';

import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PersonIcon from '@mui/icons-material/Person';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PushPinIcon from '@mui/icons-material/PushPin';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getComplaints({ createdBy: user?.id, limit: 5 });
        setRecentComplaints(res.data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (loading) return <DashboardSkeleton />;

  const stats = [
    { title: 'Total Complaints', value: studentStats.total, icon: AssignmentIcon, color: 'primary', delay: 0 },
    { title: 'Pending', value: studentStats.pending, icon: PendingActionsIcon, color: 'accent', delay: 1 },
    { title: 'In Progress', value: studentStats.inProgress, icon: AutorenewIcon, color: 'warning', delay: 2 },
    { title: 'Resolved', value: studentStats.resolved, icon: CheckCircleIcon, color: 'success', delay: 3 },
  ];

  const quickActions = [
    { label: 'Create Complaint', icon: AddCircleIcon, path: ROUTES.STUDENT_CREATE_COMPLAINT, color: 'gradient-primary text-white' },
    { label: 'Track Complaint', icon: TrackChangesIcon, path: ROUTES.STUDENT_TRACK_COMPLAINT, color: 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]' },
    { label: 'My Profile', icon: PersonIcon, path: ROUTES.PROFILE, color: 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Here's an overview of your complaint activity
          </p>
        </div>
        <Button
          icon={AddCircleIcon}
          onClick={() => navigate(ROUTES.STUDENT_CREATE_COMPLAINT)}
        >
          New Complaint
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Link
              to={action.path}
              className={`flex items-center gap-4 p-4 rounded-xl ${action.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <action.icon style={{ fontSize: 22 }} />
              </div>
              <span className="font-medium text-sm">{action.label}</span>
              <ArrowForwardIcon style={{ fontSize: 18 }} className="ml-auto opacity-60" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <Card className="lg:col-span-2" padding="p-0">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
            <h3 className="font-semibold text-[var(--text-primary)]">Recent Complaints</h3>
            <Link
              to={ROUTES.STUDENT_MY_COMPLAINTS}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {recentComplaints.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                No complaints yet. Create your first complaint!
              </div>
            ) : (
              recentComplaints.map((complaint) => (
                <Link
                  key={complaint.id}
                  to={`/student/complaints/${complaint.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {complaint.title}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                      {complaint.id} · {timeAgo(complaint.createdAt)}
                    </p>
                  </div>
                  <Badge type="status" value={complaint.status} size="xs" />
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* Right Column — Announcements + Events */}
        <div className="space-y-6">
          {/* Announcements */}
          <Card padding="p-0">
            <div className="flex items-center gap-2 p-4 border-b border-[var(--border-color)]">
              <CampaignIcon className="text-accent-500" style={{ fontSize: 20 }} />
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">Announcements</h3>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {mockAnnouncements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-4">
                  <div className="flex items-start gap-2">
                    {ann.isPinned && <PushPinIcon className="text-accent-500 shrink-0 mt-0.5" style={{ fontSize: 14 }} />}
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{ann.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">{formatDate(ann.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card padding="p-0">
            <div className="flex items-center gap-2 p-4 border-b border-[var(--border-color)]">
              <EventIcon className="text-primary-600" style={{ fontSize: 20 }} />
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">Upcoming Events</h3>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {mockEvents.map((event) => (
                <div key={event.id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary-600 leading-none">
                      {new Date(event.date).toLocaleDateString('en', { day: 'numeric' })}
                    </span>
                    <span className="text-[9px] text-primary-600/70 uppercase">
                      {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{event.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
