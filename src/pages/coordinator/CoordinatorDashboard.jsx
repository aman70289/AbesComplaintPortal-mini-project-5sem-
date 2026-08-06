/* ============================================
   CoordinatorDashboard — department-scoped view
   ============================================ */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getComplaints } from '@/services/complaintService';
import { timeAgo } from '@/utils/formatters';
import StatCard from '@/components/charts/StatCard';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import { DashboardSkeleton } from '@/components/common/SkeletonLoader';
import { BarChartComponent } from '@/components/charts/ChartComponents';

import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const CoordinatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getComplaints({ department: user?.departmentId, limit: 50 });
        setComplaints(res.data);
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const total = complaints.length;
  const pending = complaints.filter((c) => ['submitted', 'in_review'].includes(c.status)).length;
  const inProgress = complaints.filter((c) => ['assigned', 'in_progress'].includes(c.status)).length;
  const resolved = complaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;

  const chartData = [
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'In Progress', value: inProgress, color: '#2563eb' },
    { name: 'Resolved', value: resolved, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Department Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{user?.department} — Coordinator View</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Department Complaints" value={total} icon={BusinessIcon} color="primary" delay={0} />
        <StatCard title="Pending" value={pending} icon={PendingActionsIcon} color="accent" delay={1} />
        <StatCard title="In Progress" value={inProgress} icon={AssignmentIcon} color="warning" delay={2} />
        <StatCard title="Resolved" value={resolved} icon={CheckCircleIcon} color="success" delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padding="p-0">
          <div className="p-5 border-b border-[var(--border-color)]">
            <h3 className="font-semibold text-[var(--text-primary)]">Department Complaints</h3>
          </div>
          {complaints.length === 0 ? (
            <EmptyState title="No Complaints" description="No complaints for your department." />
          ) : (
            <div className="divide-y divide-[var(--border-color)]">
              {complaints.slice(0, 8).map((c) => (
                <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-[var(--hover-bg)] cursor-pointer transition-colors" onClick={() => navigate(`/student/complaints/${c.id}`)}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{c.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{c.id} · {timeAgo(c.createdAt)}</p>
                  </div>
                  <Badge type="priority" value={c.priority} size="xs" />
                  <Badge type="status" value={c.status} size="xs" dot />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Status Overview</h3>
          <BarChartComponent
            data={chartData}
            xKey="name"
            bars={[{ key: 'value', name: 'Count', color: '#2563eb' }]}
            height={250}
          />
        </Card>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
