/* ============================================
   Admin ComplaintManagement — full control
   ============================================ */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getComplaints, updateComplaintStatus, assignComplaint, exportComplaintsCSV, deleteComplaint } from '@/services/complaintService';
import { mockFacultyList } from '@/services/mockData';
import { COMPLAINT_CATEGORIES } from '@/utils/constants';
import { timeAgo } from '@/utils/formatters';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Select from '@/components/common/Select';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/SkeletonLoader';

import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';

const statusOptions = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'closed', label: 'Closed' },
];

const ComplaintManagement = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Modal states
  const [assignModal, setAssignModal] = useState({ open: false, complaint: null });
  const [statusModal, setStatusModal] = useState({ open: false, complaint: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getComplaints({ search, status: statusFilter, priority: priorityFilter, page, limit: 10 });
      setComplaints(res.data);
      setPagination(res.pagination);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [search, statusFilter, priorityFilter, page]);

  const handleAssign = async () => {
    if (!selectedFaculty || !assignModal.complaint) return;
    setActionLoading(true);
    try {
      const faculty = mockFacultyList.find((f) => f.id === selectedFaculty);
      await assignComplaint(assignModal.complaint.id, selectedFaculty, faculty?.name || 'Faculty');
      toast.success('Complaint assigned successfully');
      setAssignModal({ open: false, complaint: null });
      setSelectedFaculty('');
      fetchComplaints();
    } catch {
      toast.error('Failed to assign');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedStatus || !statusModal.complaint) return;
    setActionLoading(true);
    try {
      await updateComplaintStatus(statusModal.complaint.id, selectedStatus);
      toast.success('Status updated');
      setStatusModal({ open: false, complaint: null });
      setSelectedStatus('');
      fetchComplaints();
    } catch {
      toast.error('Failed to update');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setActionLoading(true);
    try {
      await deleteComplaint(deleteDialog.id);
      toast.success('Complaint deleted');
      setDeleteDialog({ open: false, id: null });
      fetchComplaints();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportComplaintsCSV({ search, status: statusFilter, priority: priorityFilter });
      toast.success('CSV exported');
    } catch {
      toast.error('Export failed');
    }
  };

  const toggleSelect = (id) => {
    setSelectedComplaints((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedComplaints.length === complaints.length) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(complaints.map((c) => c.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Complaint Management</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{pagination.total} total complaints</p>
        </div>
        <Button variant="outline" icon={DownloadIcon} onClick={handleExport}>Export CSV</Button>
      </div>

      {/* Filters */}
      <Card padding="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            placeholder="Search complaints..."
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            className="flex-1"
            size="sm"
            debounceMs={0}
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Status</option>
            {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {selectedComplaints.length > 0 && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {selectedComplaints.length} selected
            </span>
            <Button size="xs" variant="success" icon={CheckCircleIcon} onClick={() => { /* bulk resolve */ }}>Resolve All</Button>
            <Button size="xs" variant="danger" icon={CancelIcon} onClick={() => { /* bulk reject */ }}>Reject All</Button>
          </div>
        )}
      </Card>

      {/* Table */}
      {loading ? <TableSkeleton rows={5} /> : complaints.length === 0 ? (
        <EmptyState title="No Complaints" description="No complaints match your filters" />
      ) : (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selectedComplaints.length === complaints.length} onChange={toggleSelectAll} className="rounded" />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Complaint</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden md:table-cell">Created By</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden lg:table-cell">Assigned</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {complaints.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedComplaints.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text-primary)] line-clamp-1">{c.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{c.id} · {timeAgo(c.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--text-secondary)]">{c.createdByName}</td>
                    <td className="px-4 py-3 hidden sm:table-cell"><Badge type="priority" value={c.priority} size="xs" /></td>
                    <td className="px-4 py-3"><Badge type="status" value={c.status} size="xs" dot /></td>
                    <td className="px-4 py-3 hidden lg:table-cell text-[var(--text-secondary)] text-xs">{c.assignedToName || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/student/complaints/${c.id}`)} className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-tertiary)] hover:text-primary-600 transition-colors" title="View">
                          <VisibilityIcon style={{ fontSize: 18 }} />
                        </button>
                        <button onClick={() => { setAssignModal({ open: true, complaint: c }); }} className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-tertiary)] hover:text-primary-600 transition-colors" title="Assign">
                          <AssignmentIndIcon style={{ fontSize: 18 }} />
                        </button>
                        <button onClick={() => { setStatusModal({ open: true, complaint: c }); setSelectedStatus(c.status); }} className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-tertiary)] hover:text-accent-600 transition-colors" title="Change Status">
                          <EditIcon style={{ fontSize: 18 }} />
                        </button>
                        <button onClick={() => setDeleteDialog({ open: true, id: c.id })} className="p-1.5 rounded-lg hover:bg-danger-500/10 text-[var(--text-tertiary)] hover:text-danger-500 transition-colors" title="Delete">
                          <DeleteIcon style={{ fontSize: 18 }} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {pagination.totalPages > 1 && (
        <Pagination currentPage={page} totalPages={pagination.totalPages} totalItems={pagination.total} pageSize={10} onPageChange={setPage} />
      )}

      {/* Assign Modal */}
      <Modal
        isOpen={assignModal.open}
        onClose={() => setAssignModal({ open: false, complaint: null })}
        title="Assign Complaint"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignModal({ open: false, complaint: null })}>Cancel</Button>
            <Button onClick={handleAssign} loading={actionLoading} disabled={!selectedFaculty}>Assign</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Assign <strong>{assignModal.complaint?.title}</strong> to a faculty member:
          </p>
          <Select
            label="Select Faculty"
            name="faculty"
            options={mockFacultyList.map((f) => ({ value: f.id, label: `${f.name} (${f.department})` }))}
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          />
        </div>
      </Modal>

      {/* Status Modal */}
      <Modal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ open: false, complaint: null })}
        title="Change Status"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setStatusModal({ open: false, complaint: null })}>Cancel</Button>
            <Button onClick={handleStatusChange} loading={actionLoading}>Update</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Update status for <strong>{statusModal.complaint?.title}</strong>:
          </p>
          <Select
            label="New Status"
            name="status"
            options={statusOptions}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Complaint"
        message="This action cannot be undone. Are you sure you want to delete this complaint?"
        loading={actionLoading}
      />
    </div>
  );
};

export default ComplaintManagement;
