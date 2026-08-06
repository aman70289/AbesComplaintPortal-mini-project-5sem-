/* ============================================
   AppRouter — all routes with lazy loading
   ============================================ */
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Loader from '@/components/common/Loader';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Auth Pages (eager load for fast initial render)
import LoginPage from '@/pages/auth/LoginPage';

// Lazy-loaded pages
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const OTPVerificationPage = lazy(() => import('@/pages/auth/OTPVerificationPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Student
const StudentDashboard = lazy(() => import('@/pages/student/StudentDashboard'));
const CreateComplaint = lazy(() => import('@/pages/student/CreateComplaint'));
const MyComplaints = lazy(() => import('@/pages/student/MyComplaints'));
const ComplaintDetails = lazy(() => import('@/pages/student/ComplaintDetails'));
const TrackComplaint = lazy(() => import('@/pages/student/TrackComplaint'));

// Faculty
const FacultyDashboard = lazy(() => import('@/pages/faculty/FacultyDashboard'));

// Coordinator
const CoordinatorDashboard = lazy(() => import('@/pages/coordinator/CoordinatorDashboard'));

// Admin
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const ComplaintManagement = lazy(() => import('@/pages/admin/ComplaintManagement'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const DepartmentManagement = lazy(() => import('@/pages/admin/DepartmentManagement'));
const AnnouncementManagement = lazy(() => import('@/pages/admin/AnnouncementManagement'));
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'));

// Shared
const ProfilePage = lazy(() => import('@/pages/shared/ProfilePage'));
const NotificationPage = lazy(() => import('@/pages/shared/NotificationPage'));
const SettingsPage = lazy(() => import('@/pages/shared/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/shared/NotFoundPage'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loader text="Loading page..." />}>
    {children}
  </Suspense>
);

const AppRouter = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect root based on role
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    const routes = {
      student: '/student/dashboard',
      faculty: '/faculty/dashboard',
      coordinator: '/coordinator/dashboard',
      admin: '/admin/dashboard',
    };
    return routes[user?.role] || '/login';
  };

  return (
    <SuspenseWrapper>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/complaints/create" element={
            <ProtectedRoute allowedRoles={['student']}><CreateComplaint /></ProtectedRoute>
          } />
          <Route path="/student/complaints" element={
            <ProtectedRoute allowedRoles={['student']}><MyComplaints /></ProtectedRoute>
          } />
          <Route path="/student/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/student/track" element={
            <ProtectedRoute allowedRoles={['student']}><TrackComplaint /></ProtectedRoute>
          } />

          {/* Faculty Routes */}
          <Route path="/faculty/dashboard" element={
            <ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>
          } />
          <Route path="/faculty/complaints" element={
            <ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>
          } />

          {/* Coordinator Routes */}
          <Route path="/coordinator/dashboard" element={
            <ProtectedRoute allowedRoles={['coordinator']}><CoordinatorDashboard /></ProtectedRoute>
          } />
          <Route path="/coordinator/complaints" element={
            <ProtectedRoute allowedRoles={['coordinator']}><CoordinatorDashboard /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/complaints" element={
            <ProtectedRoute allowedRoles={['admin']}><ComplaintManagement /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>
          } />
          <Route path="/admin/departments" element={
            <ProtectedRoute allowedRoles={['admin']}><DepartmentManagement /></ProtectedRoute>
          } />
          <Route path="/admin/announcements" element={
            <ProtectedRoute allowedRoles={['admin']}><AnnouncementManagement /></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin']}><ReportsPage /></ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin']}><SettingsPage /></ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/change-password" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SuspenseWrapper>
  );
};

export default AppRouter;
