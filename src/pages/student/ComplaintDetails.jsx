/* ============================================
   ComplaintDetails — full complaint view
   ============================================ */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getComplaintById, addComment } from '@/services/complaintService';
import { formatDateTime, timeAgo } from '@/utils/formatters';
import { COMPLAINT_CATEGORIES } from '@/utils/constants';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { DashboardSkeleton } from '@/components/common/SkeletonLoader';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PendingIcon from '@mui/icons-material/Pending';

const statusIcons = {
  submitted: PendingIcon,
  in_review: PendingIcon,
  assigned: PersonIcon,
  in_progress: PendingIcon,
  resolved: CheckCircleIcon,
  rejected: RadioButtonUncheckedIcon,
  closed: CheckCircleIcon,
};

const statusColors = {
  submitted: 'text-primary-500',
  in_review: 'text-amber-500',
  assigned: 'text-indigo-500',
  in_progress: 'text-accent-500',
  resolved: 'text-success-500',
  rejected: 'text-danger-500',
  closed: 'text-surface-500',
};

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getComplaintById(id);
        setComplaint(res.data);
      } catch {
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await addComment(id, {
        user: user?.name,
        role: user?.role,
        text: commentText.trim(),
      });
      // Refresh
      const res = await getComplaintById(id);
      setComplaint(res.data);
      setCommentText('');
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (!complaint) return null;

  const category = COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Breadcrumb />

      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <ArrowBackIcon style={{ fontSize: 20 }} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
              {complaint.id}
            </span>
            <Badge type="status" value={complaint.status} dot />
            <Badge type="priority" value={complaint.priority} />
            {complaint.isAnonymous && (
              <span className="text-xs bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-full text-[var(--text-secondary)]">Anonymous</span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            {complaint.title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Description</h3>
            <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
              {complaint.description}
            </p>
          </Card>

          {/* Attachments */}
          {complaint.attachments?.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                Attachments ({complaint.attachments.length})
              </h3>
              <div className="space-y-2">
                {complaint.attachments.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <AttachFileIcon className="text-[var(--text-tertiary)]" style={{ fontSize: 20 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{file.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] transition-colors">
                      <DownloadIcon style={{ fontSize: 18 }} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Activity Timeline</h3>
            <div className="relative pl-8">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[var(--border-color)]" />

              {complaint.timeline?.map((event, i) => {
                const Icon = statusIcons[event.status] || PendingIcon;
                const color = statusColors[event.status] || 'text-surface-500';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pb-6 last:pb-0"
                  >
                    <div className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border-color)] flex items-center justify-center ${color}`}>
                      <Icon style={{ fontSize: 14 }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge type="status" value={event.status} size="xs" />
                        <span className="text-xs text-[var(--text-tertiary)]">{formatDateTime(event.date)}</span>
                      </div>
                      <p className="text-sm text-[var(--text-primary)]">{event.note}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">by {event.by}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Comments */}
          <Card>
            <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
              Comments ({complaint.comments?.length || 0})
            </h3>

            {complaint.comments?.length > 0 && (
              <div className="space-y-4 mb-6">
                {complaint.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar name={comment.user} size="sm" />
                    <div className="flex-1 bg-[var(--bg-secondary)] rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[var(--text-primary)]">{comment.user}</span>
                        <span className="text-[10px] capitalize bg-[var(--bg-card)] px-1.5 py-0.5 rounded text-[var(--text-tertiary)]">{comment.role}</span>
                        <span className="text-xs text-[var(--text-tertiary)] ml-auto">{timeAgo(comment.date)}</span>
                      </div>
                      <p className="text-sm text-[var(--text-primary)]">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment */}
            <div className="flex gap-3">
              <Avatar name={user?.name} size="sm" />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    icon={SendIcon}
                    onClick={handleAddComment}
                    loading={submitting}
                    disabled={!commentText.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Details</h3>
            <div className="space-y-4">
              {[
                { label: 'Category', value: category ? `${category.icon} ${category.label}` : complaint.category },
                { label: 'Department', value: complaint.department },
                { label: 'Created By', value: complaint.createdByName },
                { label: 'Assigned To', value: complaint.assignedToName || 'Unassigned' },
                { label: 'Created', value: formatDateTime(complaint.createdAt) },
                { label: 'Last Updated', value: formatDateTime(complaint.updatedAt) },
                { label: 'Location', value: complaint.location || '—', icon: LocationOnIcon },
                { label: 'Expected Resolution', value: complaint.expectedResolution ? formatDateTime(complaint.expectedResolution) : '—' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-[var(--text-tertiary)] mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
