/* ============================================
   Admin Service — mock implementation
   ============================================ */
import { mockStudentsList, mockFacultyList, mockAnnouncements, adminStats } from './mockData';
import { DEPARTMENTS } from '@/utils/constants';

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

let students = [...mockStudentsList];
let faculty = [...mockFacultyList];
let announcements = [...mockAnnouncements];
let departments = [...DEPARTMENTS];

// --- User Management ---
export const getUsers = async (role = 'student', filters = {}) => {
  await delay();
  let list = role === 'faculty' ? [...faculty] : [...students];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  if (filters.department) {
    list = list.filter((u) => u.department === filters.department);
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const total = list.length;

  return {
    success: true,
    data: list.slice((page - 1) * limit, page * limit),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const createUser = async (userData) => {
  await delay(800);
  const newUser = {
    id: `${userData.role === 'faculty' ? 'FAC' : 'STU'}-2024-${String(Date.now()).slice(-3)}`,
    ...userData,
    status: 'active',
  };
  if (userData.role === 'faculty') faculty.unshift(newUser);
  else students.unshift(newUser);
  return { success: true, data: newUser, message: 'User created successfully' };
};

export const updateUser = async (id, userData) => {
  await delay(500);
  const list = id.startsWith('FAC') ? faculty : students;
  const idx = list.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found');
  list[idx] = { ...list[idx], ...userData };
  return { success: true, data: list[idx] };
};

export const deleteUser = async (id) => {
  await delay(400);
  students = students.filter((u) => u.id !== id);
  faculty = faculty.filter((u) => u.id !== id);
  return { success: true, message: 'User deleted' };
};

// --- Department Management ---
export const getDepartments = async () => {
  await delay(300);
  return { success: true, data: [...departments] };
};

export const createDepartment = async (data) => {
  await delay(600);
  const newDept = { id: data.shortName.toLowerCase(), ...data };
  departments.push(newDept);
  return { success: true, data: newDept };
};

export const updateDepartment = async (id, data) => {
  await delay(400);
  const idx = departments.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error('Department not found');
  departments[idx] = { ...departments[idx], ...data };
  return { success: true, data: departments[idx] };
};

export const deleteDepartment = async (id) => {
  await delay(400);
  departments = departments.filter((d) => d.id !== id);
  return { success: true, message: 'Department deleted' };
};

// --- Announcement Management ---
export const getAnnouncements = async () => {
  await delay(300);
  return { success: true, data: [...announcements].sort((a, b) => b.isPinned - a.isPinned || new Date(b.createdAt) - new Date(a.createdAt)) };
};

export const createAnnouncement = async (data) => {
  await delay(600);
  const newAnn = { id: `a-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  announcements.unshift(newAnn);
  return { success: true, data: newAnn };
};

export const updateAnnouncement = async (id, data) => {
  await delay(400);
  const idx = announcements.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('Announcement not found');
  announcements[idx] = { ...announcements[idx], ...data };
  return { success: true, data: announcements[idx] };
};

export const deleteAnnouncement = async (id) => {
  await delay(400);
  announcements = announcements.filter((a) => a.id !== id);
  return { success: true, message: 'Announcement deleted' };
};

// --- Admin Stats ---
export const getAdminStats = async () => {
  await delay(400);
  return { success: true, data: { ...adminStats } };
};

// --- Reports ---
export const generateReport = async (type, dateRange) => {
  await delay(1500);
  return {
    success: true,
    message: `${type} report generated successfully`,
    data: { downloadUrl: '#' },
  };
};
