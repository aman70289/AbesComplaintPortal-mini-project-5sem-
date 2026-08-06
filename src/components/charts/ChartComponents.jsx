/* ============================================
   Chart Wrappers — Recharts components
   ============================================ */
import {
  LineChart as ReLineChart, Line,
  BarChart as ReBarChart, Bar,
  PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';

// Shared tooltip style
const useTooltipStyle = () => {
  const { isDark } = useTheme();
  return {
    contentStyle: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      borderRadius: '0.75rem',
      boxShadow: '0 10px 40px -5px rgba(0,0,0,0.12)',
      padding: '12px 16px',
      fontSize: '13px',
      color: isDark ? '#f1f5f9' : '#0f172a',
    },
    labelStyle: { fontWeight: 600, marginBottom: '4px' },
    cursor: { fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
  };
};

// --- Area / Line Chart ---
export const AreaLineChart = ({
  data,
  xKey = 'month',
  lines = [],
  height = 300,
  showGrid = true,
  className = '',
}) => {
  const tooltipStyle = useTooltipStyle();
  const { isDark } = useTheme();

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />}
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }} />
          {lines.map((line, i) => (
            <Area
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name || line.key}
              stroke={line.color}
              fill={line.color}
              fillOpacity={0.1}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Bar Chart ---
export const BarChartComponent = ({
  data,
  xKey = 'department',
  bars = [],
  height = 300,
  layout = 'vertical',
  className = '',
}) => {
  const tooltipStyle = useTooltipStyle();
  const { isDark } = useTheme();
  const isHorizontal = layout === 'horizontal';

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={data} layout={isHorizontal ? 'vertical' : undefined} margin={{ top: 5, right: 5, left: isHorizontal ? 40 : -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
          {isHorizontal ? (
            <>
              <XAxis type="number" tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis dataKey={xKey} type="category" tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} width={80} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
            </>
          )}
          <Tooltip {...tooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }} />
          {bars.map((bar) => (
            <Bar key={bar.key} dataKey={bar.key} name={bar.name || bar.key} fill={bar.color} radius={[4, 4, 0, 0]} maxBarSize={40} />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Pie / Donut Chart ---
export const PieChartComponent = ({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  className = '',
}) => {
  const tooltipStyle = useTooltipStyle();

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            dataKey="value"
            animationBegin={200}
            animationDuration={800}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', lineHeight: '24px' }}
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};
