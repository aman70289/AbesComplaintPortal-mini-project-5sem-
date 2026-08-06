/* ============================================
   TrackComplaint — search and track status
   ============================================ */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getComplaintById } from '@/services/complaintService';
import { formatDateTime } from '@/utils/formatters';
import { COMPLAINT_STATUSES } from '@/utils/constants';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { ROUTES } from '@/utils/constants';

import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const TrackComplaint = () => {
  const [searchId, setSearchId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusFlow = ['submitted', 'in_review', 'assigned', 'in_progress', 'resolved'];

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setLoading(true);
    setError('');
    setComplaint(null);
    try {
      const res = await getComplaintById(searchId.trim());
      setComplaint(res.data);
    } catch {
      setError('Complaint not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = complaint ? statusFlow.indexOf(complaint.status) : -1;
  const isRejected = complaint?.status === 'rejected';
  const isClosed = complaint?.status === 'closed';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Breadcrumb items={[
        { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, isLast: false },
        { label: 'Track Complaint', path: '#', isLast: true },
      ]} />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <TrackChangesIcon className="text-white" style={{ fontSize: 32 }} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Track Your Complaint</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Enter your complaint ID to check its current status
          </p>
        </div>

        {/* Search bar */}
        <Card padding="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                style={{ fontSize: 20 }}
              />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Complaint ID (e.g., CMP-2024-00001)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <Button size="lg" onClick={handleSearch} loading={loading}>
              Track
            </Button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-danger-500 mt-3 text-center"
            >
              {error}
            </motion.p>
          )}
        </Card>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {complaint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Complaint header */}
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-mono text-primary-600">{complaint.id}</span>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-1">{complaint.title}</h2>
                </div>
                <Badge type="status" value={complaint.status} size="md" dot />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Department</p>
                  <p className="font-medium text-[var(--text-primary)]">{complaint.department}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Priority</p>
                  <Badge type="priority" value={complaint.priority} size="xs" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Assigned To</p>
                  <p className="font-medium text-[var(--text-primary)]">{complaint.assignedToName || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Created</p>
                  <p className="font-medium text-[var(--text-primary)]">{formatDateTime(complaint.createdAt)}</p>
                </div>
              </div>
            </Card>

            {/* Progress Bar */}
            <Card>
              <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-6">
                Status Progress
              </h3>

              {isRejected ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-danger-500/10 flex items-center justify-center mx-auto mb-3">
                    <RadioButtonUncheckedIcon className="text-danger-500" style={{ fontSize: 32 }} />
                  </div>
                  <p className="text-lg font-semibold text-danger-500">Complaint Rejected</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {complaint.timeline?.[complaint.timeline.length - 1]?.note}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress steps */}
                  <div className="flex items-center justify-between">
                    {statusFlow.map((status, i) => {
                      const isCompleted = i <= currentStepIndex;
                      const isCurrent = i === currentStepIndex;
                      const label = COMPLAINT_STATUSES[status]?.label || status;

                      return (
                        <div key={status} className="flex flex-col items-center relative z-10 flex-1">
                          {/* Connector line */}
                          {i > 0 && (
                            <div
                              className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 transition-colors duration-500 ${
                                isCompleted ? 'bg-success-500' : 'bg-[var(--border-color)]'
                              }`}
                            />
                          )}

                          {/* Step dot */}
                          <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.15 }}
                            className={`
                              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                              ${isCompleted
                                ? 'bg-success-500 text-white'
                                : 'bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] text-[var(--text-tertiary)]'
                              }
                              ${isCurrent ? 'ring-4 ring-success-500/20' : ''}
                            `}
                          >
                            {isCompleted ? (
                              <CheckCircleIcon style={{ fontSize: 18 }} />
                            ) : (
                              <span className="text-xs font-bold">{i + 1}</span>
                            )}
                          </motion.div>

                          {/* Label */}
                          <span className={`text-[10px] sm:text-xs mt-2 text-center font-medium ${
                            isCurrent ? 'text-success-600' : isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                          }`}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>

            {/* Timeline */}
            <Card>
              <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Timeline</h3>
              <div className="space-y-4">
                {complaint.timeline?.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge type="status" value={event.status} size="xs" />
                        <span className="text-xs text-[var(--text-tertiary)]">{formatDateTime(event.date)}</span>
                      </div>
                      <p className="text-sm text-[var(--text-primary)] mt-1">{event.note}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrackComplaint;
