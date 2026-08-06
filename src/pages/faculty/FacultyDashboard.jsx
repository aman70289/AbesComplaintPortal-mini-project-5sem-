/* ============================================
   FacultyDashboard — assigned complaints overview
   ============================================ */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getComplaints, updateComplaintStatus } from '@/services/complaintService';
import { timeAgo } from '@/utils/formatters';
import StatCard from '@/components/charts/StatCard';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import { DashboardSkeleton } from '@/components/common/SkeletonLoader';
import toast from 'react-hot-toast';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getComplaints({ assignedTo: user?.id, limit: 50 });
      setComplaints(res.data);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  if (loading) return <DashboardSkeleton />;

  const assigned = complaints.filter((c) => c.status === 'assigned').length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateComplaintStatus(id, status);
      toast.success('Status updated');
      fetchComplaints();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Faculty Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Welcome, {user?.name}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assigned" value={complaints.length} icon={AssignmentIndIcon} color="primary" delay={0} />
        <StatCard title="Pending Action" value={assigned} icon={PendingActionsIcon} color="accent" delay={1} />
        <StatCard title="In Progress" value={inProgress} icon={AutorenewIcon} color="warning" delay={2} />
        <StatCard title="Resolved" value={resolved} icon={CheckCircleIcon} color="success" delay={3} />
      </div>

      <Card padding="p-0">
        <div className="p-5 border-b border-[var(--border-color)]">
          <h3 className="font-semibold text-[var(--text-primary)]">Assigned Complaints</h3>
        </div>
        {complaints.length === 0 ? (
          <EmptyState title="No Assigned Complaints" description="You have no complaints assigned to you." />
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {complaints.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-[var(--hover-bg)] transition-colors">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/student/complaints/${c.id}`)}>
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--text-tertiary)]">{c.id}</span>
                    <Badge type="priority" value={c.priority} size="xs" />
                    <span className="text-xs text-[var(--text-tertiary)]">{timeAgo(c.createdAt)}</span>
                  </div>
                </div>
                <Badge type="status" value={c.status} size="xs" dot />
                <div className="flex gap-1">
                  {c.status === 'assigned' && (
                    <Button size="xs" variant="accent" onClick={() => handleStatusUpdate(c.id, 'in_progress')}>Start</Button>
                  )}
                  {c.status === 'in_progress' && (
                    <Button size="xs" variant="success" onClick={() => handleStatusUpdate(c.id, 'resolved')}>Resolve</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FacultyDashboard;
