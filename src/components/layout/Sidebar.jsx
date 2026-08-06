/* ============================================
   Sidebar — role-based collapsible navigation
   ============================================ */
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { SIDEBAR_MENUS } from '@/utils/constants';
import Avatar from '@/components/common/Avatar';

// MUI Icons mapped by name
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';

const iconMap = {
  Dashboard: DashboardIcon,
  AddCircle: AddCircleIcon,
  Assignment: AssignmentIcon,
  TrackChanges: TrackChangesIcon,
  Notifications: NotificationsIcon,
  Person: PersonIcon,
  AssignmentInd: AssignmentIndIcon,
  Business: BusinessIcon,
  People: PeopleIcon,
  Campaign: CampaignIcon,
  Assessment: AssessmentIcon,
  Settings: SettingsIcon,
};

const Sidebar = ({ isOpen, onToggle, isMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = SIDEBAR_MENUS[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarWidth = isOpen ? 'w-64' : 'w-[72px]';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-[var(--border-color)] shrink-0 ${!isOpen && !isMobile ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <SchoolIcon className="text-white" style={{ fontSize: 20 }} />
        </div>
        {(isOpen || isMobile) && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden"
          >
            <h1 className="text-sm font-bold text-[var(--text-primary)] leading-tight">ABES</h1>
            <p className="text-[10px] text-[var(--text-tertiary)] leading-tight">Complaint Portal</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon] || DashboardIcon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={isMobile ? onToggle : undefined}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${isActive
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/25'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                }
                ${!isOpen && !isMobile ? 'justify-center' : ''}
              `}
            >
              <Icon style={{ fontSize: 20 }} className="shrink-0" />
              {(isOpen || isMobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}

              {/* Tooltip for collapsed sidebar */}
              {!isOpen && !isMobile && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-surface-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-surface-900 rotate-45" />
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-[var(--border-color)] p-3 shrink-0">
        {(isOpen || isMobile) && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <Avatar name={user?.name} size="sm" />
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
              <p className="text-[11px] text-[var(--text-tertiary)] capitalize">{user?.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`
            flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-danger-500 hover:bg-danger-500/10 transition-all duration-200
            ${!isOpen && !isMobile ? 'justify-center' : ''}
          `}
        >
          <LogoutIcon style={{ fontSize: 20 }} />
          {(isOpen || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  // Mobile: overlay drawer
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onToggle}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 h-full w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] z-50 shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: persistent sidebar
  return (
    <aside
      className={`
        hidden lg:flex flex-col h-screen sticky top-0
        bg-[var(--bg-sidebar)] border-r border-[var(--border-color)]
        transition-all duration-300 ease-in-out
        ${sidebarWidth} shrink-0
      `}
    >
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;
