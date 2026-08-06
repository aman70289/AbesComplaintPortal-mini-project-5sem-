/* ============================================
   Formatting utilities
   ============================================ */

/**
 * Format a date string to a human-readable format
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '—';
  const d = new Date(date);
  const defaults = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-IN', { ...defaults, ...options });
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

/**
 * Relative time (e.g., "2 hours ago", "3 days ago")
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return formatDate(date);
};

/**
 * Format file size in bytes to human-readable string
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Format a number with commas (e.g., 1234 → "1,234")
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('en-IN');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Generate a random complaint ID like "CMP-2024-00042"
 */
export const generateComplaintId = () => {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `CMP-${year}-${num}`;
};

/**
 * Get initials from a name (e.g., "Rohit Sharma" → "RS")
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert snake_case or kebab-case to Title Case
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Generate a color from a string (deterministic)
 */
export const stringToColor = (str) => {
  if (!str) return '#64748b';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#1e3a8a', '#2563eb', '#7c3aed', '#db2777',
    '#059669', '#d97706', '#dc2626', '#0891b2',
  ];
  return colors[Math.abs(hash) % colors.length];
};
