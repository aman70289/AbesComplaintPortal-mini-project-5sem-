/* ============================================
   Application-wide constants
   ============================================ */

// Complaint categories available for filing
export const COMPLAINT_CATEGORIES = [
  { value: 'hostel', label: 'Hostel', icon: '🏠' },
  { value: 'transport', label: 'Transport', icon: '🚌' },
  { value: 'library', label: 'Library', icon: '📚' },
  { value: 'examination', label: 'Examination', icon: '📝' },
  { value: 'accounts', label: 'Accounts', icon: '💰' },
  { value: 'canteen', label: 'Canteen', icon: '🍽️' },
  { value: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
  { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
  { value: 'classroom', label: 'Classroom', icon: '🏫' },
  { value: 'internet', label: 'Internet', icon: '🌐' },
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'water', label: 'Water', icon: '💧' },
  { value: 'washroom', label: 'Washroom', icon: '🚻' },
  { value: 'security', label: 'Security', icon: '🔒' },
  { value: 'anti_ragging', label: 'Anti Ragging', icon: '🛡️' },
  { value: 'harassment', label: 'Harassment', icon: '⚠️' },
  { value: 'other', label: 'Other', icon: '📋' },
];

// Complaint statuses with their properties
export const COMPLAINT_STATUSES = {
  draft: { label: 'Draft', color: 'gray', bgClass: 'bg-surface-200 text-surface-700', darkBgClass: 'dark:bg-surface-700 dark:text-surface-300' },
  submitted: { label: 'Submitted', color: 'blue', bgClass: 'bg-primary-100 text-primary-800', darkBgClass: 'dark:bg-primary-900/30 dark:text-primary-300' },
  in_review: { label: 'In Review', color: 'amber', bgClass: 'bg-amber-100 text-amber-800', darkBgClass: 'dark:bg-amber-900/30 dark:text-amber-300' },
  assigned: { label: 'Assigned', color: 'indigo', bgClass: 'bg-indigo-100 text-indigo-800', darkBgClass: 'dark:bg-indigo-900/30 dark:text-indigo-300' },
  in_progress: { label: 'In Progress', color: 'yellow', bgClass: 'bg-accent-400/20 text-accent-600', darkBgClass: 'dark:bg-accent-500/20 dark:text-accent-400' },
  resolved: { label: 'Resolved', color: 'green', bgClass: 'bg-success-500/10 text-success-600', darkBgClass: 'dark:bg-success-500/20 dark:text-success-400' },
  rejected: { label: 'Rejected', color: 'red', bgClass: 'bg-danger-500/10 text-danger-600', darkBgClass: 'dark:bg-danger-500/20 dark:text-danger-400' },
  closed: { label: 'Closed', color: 'gray', bgClass: 'bg-surface-200 text-surface-700', darkBgClass: 'dark:bg-surface-700 dark:text-surface-300' },
};

// Priority levels
export const PRIORITIES = {
  low: { label: 'Low', color: '#10b981', bgClass: 'bg-success-500/10 text-success-600' },
  medium: { label: 'Medium', color: '#f59e0b', bgClass: 'bg-accent-400/20 text-accent-600' },
  high: { label: 'High', color: '#f97316', bgClass: 'bg-warning-500/10 text-warning-600' },
  urgent: { label: 'Urgent', color: '#ef4444', bgClass: 'bg-danger-500/10 text-danger-600' },
};

// User roles
export const USER_ROLES = {
  student: { label: 'Student', value: 'student' },
  faculty: { label: 'Faculty', value: 'faculty' },
  coordinator: { label: 'Department Coordinator', value: 'coordinator' },
  admin: { label: 'Administrator', value: 'admin' },
};

// Departments
export const DEPARTMENTS = [
  { id: 'cse', name: 'Computer Science & Engineering', shortName: 'CSE', coordinator: 'Dr. Priya Sharma' },
  { id: 'ece', name: 'Electronics & Communication', shortName: 'ECE', coordinator: 'Dr. Rajesh Kumar' },
  { id: 'me', name: 'Mechanical Engineering', shortName: 'ME', coordinator: 'Dr. Anil Gupta' },
  { id: 'ce', name: 'Civil Engineering', shortName: 'CE', coordinator: 'Dr. Neha Singh' },
  { id: 'ee', name: 'Electrical Engineering', shortName: 'EE', coordinator: 'Dr. Vikram Patel' },
  { id: 'it', name: 'Information Technology', shortName: 'IT', coordinator: 'Dr. Sanjay Verma' },
  { id: 'mba', name: 'Management Studies', shortName: 'MBA', coordinator: 'Dr. Kavita Jain' },
  { id: 'mca', name: 'Computer Applications', shortName: 'MCA', coordinator: 'Dr. Amit Saxena' },
  { id: 'admin_dept', name: 'Administration', shortName: 'Admin', coordinator: 'Mr. Ravi Tiwari' },
  { id: 'hostel', name: 'Hostel Management', shortName: 'Hostel', coordinator: 'Mr. Deepak Yadav' },
];

// Route paths
export const ROUTES = {
  // Public
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  OTP_VERIFICATION: '/otp-verification',
  RESET_PASSWORD: '/reset-password',

  // Student
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_CREATE_COMPLAINT: '/student/complaints/create',
  STUDENT_MY_COMPLAINTS: '/student/complaints',
  STUDENT_COMPLAINT_DETAILS: '/student/complaints/:id',
  STUDENT_TRACK_COMPLAINT: '/student/track',

  // Faculty
  FACULTY_DASHBOARD: '/faculty/dashboard',
  FACULTY_ASSIGNED_COMPLAINTS: '/faculty/complaints',

  // Coordinator
  COORDINATOR_DASHBOARD: '/coordinator/dashboard',
  COORDINATOR_DEPARTMENT_COMPLAINTS: '/coordinator/complaints',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_COMPLAINTS: '/admin/complaints',
  ADMIN_USERS: '/admin/users',
  ADMIN_DEPARTMENTS: '/admin/departments',
  ADMIN_ANNOUNCEMENTS: '/admin/announcements',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',

  // Shared
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  CHANGE_PASSWORD: '/change-password',
};

// Sidebar menu configuration per role
export const SIDEBAR_MENUS = {
  student: [
    { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, icon: 'Dashboard' },
    { label: 'Create Complaint', path: ROUTES.STUDENT_CREATE_COMPLAINT, icon: 'AddCircle' },
    { label: 'My Complaints', path: ROUTES.STUDENT_MY_COMPLAINTS, icon: 'Assignment' },
    { label: 'Track Complaint', path: ROUTES.STUDENT_TRACK_COMPLAINT, icon: 'TrackChanges' },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: 'Notifications' },
    { label: 'Profile', path: ROUTES.PROFILE, icon: 'Person' },
  ],
  faculty: [
    { label: 'Dashboard', path: ROUTES.FACULTY_DASHBOARD, icon: 'Dashboard' },
    { label: 'Assigned Complaints', path: ROUTES.FACULTY_ASSIGNED_COMPLAINTS, icon: 'AssignmentInd' },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: 'Notifications' },
    { label: 'Profile', path: ROUTES.PROFILE, icon: 'Person' },
  ],
  coordinator: [
    { label: 'Dashboard', path: ROUTES.COORDINATOR_DASHBOARD, icon: 'Dashboard' },
    { label: 'Department Complaints', path: ROUTES.COORDINATOR_DEPARTMENT_COMPLAINTS, icon: 'Business' },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: 'Notifications' },
    { label: 'Profile', path: ROUTES.PROFILE, icon: 'Person' },
  ],
  admin: [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: 'Dashboard' },
    { label: 'Complaints', path: ROUTES.ADMIN_COMPLAINTS, icon: 'Assignment' },
    { label: 'Users', path: ROUTES.ADMIN_USERS, icon: 'People' },
    { label: 'Departments', path: ROUTES.ADMIN_DEPARTMENTS, icon: 'Business' },
    { label: 'Announcements', path: ROUTES.ADMIN_ANNOUNCEMENTS, icon: 'Campaign' },
    { label: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: 'Assessment' },
    { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: 'Settings' },
  ],
};

// File upload config
export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  acceptedDocTypes: ['application/pdf'],
  maxFiles: 5,
};

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
};
