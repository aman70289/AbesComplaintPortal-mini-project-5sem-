/* ============================================
   AdminDashboard — analytics & charts
   ============================================ */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  adminStats, monthlyComplaintData,
  departmentComplaintData, categoryPieData, mockComplaints,
} from '@/services/mockData';
import { timeAgo } from '@/utils/formatters';
import StatCard from '@/components/charts/StatCard';
import { AreaLineChart, BarChartComponent, PieChartComponent } from '@/components/charts/ChartComponents';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { DashboardSkeleton } from '@/components/common/SkeletonLoader';

import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const stats = adminStats;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: SchoolIcon, color: 'primary', delay: 0 },
    { title: 'Active Complaints', value: stats.activeComplaints, icon: AssignmentIcon, color: 'accent', delay: 1, trend: 'down', trendValue: `${Math.abs(stats.growthRate)}%` },
    { title: 'Pending Review', value: stats.pendingComplaints, icon: PendingActionsIcon, color: 'warning', delay: 2 },
    { title: 'Resolved', value: stats.resolvedComplaints, icon: CheckCircleIcon, color: 'success', delay: 3 },
    { title: 'Avg. Resolution', value: stats.avgResolutionTime, icon: TimerIcon, color: 'indigo', delay: 4 },
    { title: 'Satisfaction', value: `${stats.satisfactionRate}%`, icon: ThumbUpIcon, color: 'success', delay: 5 },
  ];

  const recentActivities = mockComplaints
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Welcome back, {user?.name}. Here's your campus overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Monthly Complaint Trends</h3>
          <AreaLineChart
            data={monthlyComplaintData}
            xKey="month"
            lines={[
              { key: 'complaints', name: 'Total Complaints', color: '#2563eb' },
              { key: 'resolved', name: 'Resolved', color: '#10b981' },
            ]}
            height={280}
          />
        </Card>

        {/* Category Pie */}
        <Card>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">By Category</h3>
          <PieChartComponent
            data={categoryPieData}
            height={280}
            innerRadius={50}
            outerRadius={85}
          />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Bar */}
        <Card>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Department-wise Complaints</h3>
          <BarChartComponent
            data={departmentComplaintData}
            xKey="department"
            bars={[
              { key: 'complaints', name: 'Total', color: '#2563eb' },
              { key: 'resolved', name: 'Resolved', color: '#10b981' },
            ]}
            height={280}
          />
        </Card>

        {/* Recent Activities */}
        <Card padding="p-0">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activities</h3>
          </div>
          <div className="divide-y divide-[var(--border-color)] max-h-[320px] overflow-y-auto scrollbar-hide">
            {recentActivities.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-4 hover:bg-[var(--hover-bg)] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--text-tertiary)]">{c.id}</span>
                    <span className="text-xs text-[var(--text-tertiary)]">·</span>
                    <span className="text-xs text-[var(--text-tertiary)]">{timeAgo(c.updatedAt)}</span>
                  </div>
                </div>
                <Badge type="status" value={c.status} size="xs" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
