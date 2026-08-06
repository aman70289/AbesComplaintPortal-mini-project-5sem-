/* ============================================
   ReportsPage — admin reports with charts
   ============================================ */
import { useState } from 'react';
import toast from 'react-hot-toast';
import { monthlyComplaintData, departmentComplaintData, categoryPieData } from '@/services/mockData';
import { AreaLineChart, BarChartComponent, PieChartComponent } from '@/components/charts/ChartComponents';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('year');

  const handleExport = (type) => {
    toast.success(`${type} report download started`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline" icon={DownloadIcon} size="sm" onClick={() => handleExport('PDF')}>PDF</Button>
          <Button variant="outline" icon={DownloadIcon} size="sm" onClick={() => handleExport('Excel')}>Excel</Button>
        </div>
      </div>

      {/* Date range selector */}
      <Card padding="p-4">
        <div className="flex items-center gap-2">
          <CalendarTodayIcon className="text-[var(--text-tertiary)]" style={{ fontSize: 18 }} />
          <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-lg">
            {['month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                  dateRange === range ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'
                }`}
              >
                This {range}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Monthly trend */}
      <Card>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Monthly Complaint Trends</h3>
        <AreaLineChart
          data={monthlyComplaintData}
          lines={[
            { key: 'complaints', name: 'Total', color: '#2563eb' },
            { key: 'resolved', name: 'Resolved', color: '#10b981' },
          ]}
          height={320}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Department Performance</h3>
          <BarChartComponent
            data={departmentComplaintData}
            bars={[
              { key: 'complaints', name: 'Total', color: '#2563eb' },
              { key: 'resolved', name: 'Resolved', color: '#10b981' },
            ]}
            height={300}
          />
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Category Distribution</h3>
          <PieChartComponent data={categoryPieData} height={300} innerRadius={55} outerRadius={95} />
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
