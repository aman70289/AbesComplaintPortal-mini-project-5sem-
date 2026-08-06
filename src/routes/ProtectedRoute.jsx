/* ============================================
   ProtectedRoute — auth & role-based guard
   ============================================ */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/utils/constants';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to their own dashboard
    const dashboardMap = {
      student: ROUTES.STUDENT_DASHBOARD,
      faculty: ROUTES.FACULTY_DASHBOARD,
      coordinator: ROUTES.COORDINATOR_DASHBOARD,
      admin: ROUTES.ADMIN_DASHBOARD,
    };
    return <Navigate to={dashboardMap[user?.role] || ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
