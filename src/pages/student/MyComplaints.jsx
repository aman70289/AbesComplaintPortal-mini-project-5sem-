/* ============================================
   MyComplaints — table + card view with filters
   ============================================ */
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getComplaints } from '@/services/complaintService';
import { COMPLAINT_CATEGORIES, ROUTES } from '@/utils/constants';
import { formatDate, timeAgo } from '@/utils/formatters';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/SkeletonLoader';
import Breadcrumb from '@/components/layout/Breadcrumb';

import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';

const statusFilters = [
  { value: '', label: 'All Status' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'closed', label: 'Closed' },
];

const priorityFilters = [
  { value: '', label: 'All Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const MyComplaints = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const filters = {
        createdBy: user?.id,
        search,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      };
      const res = await getComplaints(filters);
      setComplaints(res.data);
      setPagination(res.pagination);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [search, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder, page]);

  const activeFilterCount = [statusFilter, priorityFilter, categoryFilter].filter(Boolean).length;

  const clearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, isLast: false },
        { label: 'My Complaints', path: '#', isLast: true },
      ]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Complaints</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{pagination.total} total complaints</p>
        </div>
        <Button icon={AddCircleIcon} onClick={() => navigate(ROUTES.STUDENT_CREATE_COMPLAINT)}>
          New Complaint
        </Button>
      </div>

      {/* Toolbar */}
      <Card padding="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <SearchBar
            placeholder="Search by title, ID, or description..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            className="flex-1"
            size="sm"
            debounceMs={0}
          />

          <div className="flex items-center gap-2">
            {/* Filter toggle */}
            <Button
              variant={showFilters ? 'secondary' : 'ghost'}
              size="sm"
              icon={FilterListIcon}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by); setSortOrder(order); setPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="priority-desc">Highest Priority</option>
              <option value="priority-asc">Lowest Priority</option>
            </select>

            {/* View toggle */}
            <div className="flex rounded-lg border border-[var(--border-color)] overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-primary-600 text-white' : 'text-[var(--text-tertiary)] hover:bg-[var(--hover-bg)]'}`}
                aria-label="Table view"
              >
                <ViewListIcon style={{ fontSize: 18 }} />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 transition-colors ${viewMode === 'card' ? 'bg-primary-600 text-white' : 'text-[var(--text-tertiary)] hover:bg-[var(--hover-bg)]'}`}
                aria-label="Card view"
              >
                <ViewModuleIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {statusFilters.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {priorityFilters.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All Categories</option>
                  {COMPLAINT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {activeFilterCount > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    <CloseIcon style={{ fontSize: 14 }} /> Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Content */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={AssignmentIcon}
          title="No Complaints Found"
          description={search || activeFilterCount > 0 ? 'Try adjusting your filters or search terms' : 'You haven\'t submitted any complaints yet. Create your first one!'}
          actionLabel={!search && activeFilterCount === 0 ? 'Create Complaint' : 'Clear Filters'}
          onAction={() => {
            if (!search && activeFilterCount === 0) navigate(ROUTES.STUDENT_CREATE_COMPLAINT);
            else clearFilters();
          }}
        />
      ) : viewMode === 'table' ? (
        /* Table View */
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden md:table-cell">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {complaints.map((complaint, i) => (
                  <motion.tr
                    key={complaint.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => navigate(`/student/complaints/${complaint.id}`)}
                    className="hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-primary-600">{complaint.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text-primary)] line-clamp-1">{complaint.title}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-[var(--text-secondary)] capitalize">
                        {COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category)?.label || complaint.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge type="priority" value={complaint.priority} size="xs" />
                    </td>
                    <td className="px-4 py-3">
                      <Badge type="status" value={complaint.status} size="xs" dot />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-[var(--text-tertiary)]">
                      {timeAgo(complaint.createdAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map((complaint, i) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                variant="interactive"
                padding="p-4"
                onClick={() => navigate(`/student/complaints/${complaint.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono text-primary-600">{complaint.id}</span>
                  <Badge type="status" value={complaint.status} size="xs" dot />
                </div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 mb-2">
                  {complaint.title}
                </h4>
                <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 mb-3">
                  {complaint.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge type="priority" value={complaint.priority} size="xs" />
                  <span className="text-xs text-[var(--text-tertiary)]">{timeAgo(complaint.createdAt)}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={10}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default MyComplaints;
