/* ============================================
   Complaint Service — mock implementation
   ============================================ */
import { mockComplaints } from './mockData';
import { generateComplaintId } from '@/utils/formatters';

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory store for demo (starts with mock data)
let complaints = [...mockComplaints];

/**
 * Get all complaints (with optional filters)
 */
export const getComplaints = async (filters = {}) => {
  await delay(500);

  let result = [...complaints];

  // Filter by status
  if (filters.status) {
    result = result.filter((c) => c.status === filters.status);
  }

  // Filter by priority
  if (filters.priority) {
    result = result.filter((c) => c.priority === filters.priority);
  }

  // Filter by category
  if (filters.category) {
    result = result.filter((c) => c.category === filters.category);
  }

  // Filter by department
  if (filters.department) {
    result = result.filter((c) => c.departmentId === filters.department);
  }

  // Filter by user
  if (filters.createdBy) {
    result = result.filter((c) => c.createdBy === filters.createdBy);
  }

  // Filter by assigned faculty
  if (filters.assignedTo) {
    result = result.filter((c) => c.assignedTo === filters.assignedTo);
  }

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  // Sort
  if (filters.sortBy) {
    const dir = filters.sortOrder === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      if (filters.sortBy === 'createdAt') return dir * (new Date(a.createdAt) - new Date(b.createdAt));
      if (filters.sortBy === 'priority') {
        const order = { urgent: 4, high: 3, medium: 2, low: 1 };
        return dir * (order[a.priority] - order[b.priority]);
      }
      return 0;
    });
  } else {
    // Default: newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const total = result.length;
  const paginated = result.slice((page - 1) * limit, page * limit);

  return {
    success: true,
    data: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single complaint by ID
 */
export const getComplaintById = async (id) => {
  await delay(400);
  const complaint = complaints.find((c) => c.id === id);
  if (!complaint) throw new Error('Complaint not found');
  return { success: true, data: complaint };
};

/**
 * Create a new complaint
 */
export const createComplaint = async (data) => {
  await delay(1000);
  const newComplaint = {
    id: generateComplaintId(),
    ...data,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: null,
    assignedToName: null,
    attachments: data.attachments || [],
    timeline: [
      {
        status: 'submitted',
        date: new Date().toISOString(),
        note: data.isAnonymous ? 'Anonymous complaint submitted' : 'Complaint submitted by student',
        by: data.isAnonymous ? 'Anonymous' : data.createdByName,
      },
    ],
    comments: [],
  };

  complaints.unshift(newComplaint);
  return { success: true, data: newComplaint, message: 'Complaint submitted successfully' };
};

/**
 * Update complaint status (admin/faculty)
 */
export const updateComplaintStatus = async (id, status, note = '') => {
  await delay(500);
  const idx = complaints.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error('Complaint not found');

  complaints[idx] = {
    ...complaints[idx],
    status,
    updatedAt: new Date().toISOString(),
    timeline: [
      ...complaints[idx].timeline,
      { status, date: new Date().toISOString(), note: note || `Status changed to ${status}`, by: 'Admin' },
    ],
  };

  return { success: true, data: complaints[idx] };
};

/**
 * Assign complaint to faculty
 */
export const assignComplaint = async (id, facultyId, facultyName) => {
  await delay(500);
  const idx = complaints.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error('Complaint not found');

  complaints[idx] = {
    ...complaints[idx],
    assignedTo: facultyId,
    assignedToName: facultyName,
    status: 'assigned',
    updatedAt: new Date().toISOString(),
    timeline: [
      ...complaints[idx].timeline,
      { status: 'assigned', date: new Date().toISOString(), note: `Assigned to ${facultyName}`, by: 'Admin' },
    ],
  };

  return { success: true, data: complaints[idx] };
};

/**
 * Add comment to a complaint
 */
export const addComment = async (complaintId, comment) => {
  await delay(400);
  const idx = complaints.findIndex((c) => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const newComment = {
    id: `c-${Date.now()}`,
    ...comment,
    date: new Date().toISOString(),
  };

  complaints[idx] = {
    ...complaints[idx],
    comments: [...complaints[idx].comments, newComment],
    updatedAt: new Date().toISOString(),
  };

  return { success: true, data: newComment };
};

/**
 * Delete a complaint (admin only)
 */
export const deleteComplaint = async (id) => {
  await delay(400);
  complaints = complaints.filter((c) => c.id !== id);
  return { success: true, message: 'Complaint deleted' };
};

/**
 * Export complaints to CSV (returns a download link simulation)
 */
export const exportComplaintsCSV = async (filters = {}) => {
  await delay(1000);
  // In production, this would return a file URL from the backend
  const result = await getComplaints({ ...filters, limit: 9999 });
  const csv = [
    'ID,Title,Category,Department,Status,Priority,Created By,Created At',
    ...result.data.map((c) =>
      `${c.id},${c.title},${c.category},${c.department},${c.status},${c.priority},${c.createdByName},${c.createdAt}`
    ),
  ].join('\n');

  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `complaints_export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  return { success: true, message: 'Export completed' };
};
