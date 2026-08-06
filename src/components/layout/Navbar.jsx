/* ============================================
   Navbar — top navigation bar
   ============================================ */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/context/NotificationContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useClickOutside from '@/hooks/useClickOutside';
import Avatar from '@/components/common/Avatar';
import SearchBar from '@/components/common/SearchBar';

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/VpnKey';

const Navbar = ({ sidebarOpen, onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const profileRef = useClickOutside(() => setProfileOpen(false));

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login');
  };

  const profileMenuItems = [
    { label: 'My Profile', icon: PersonIcon, action: () => { navigate('/profile'); setProfileOpen(false); } },
    { label: 'Settings', icon: SettingsIcon, action: () => { navigate('/settings'); setProfileOpen(false); } },
    { label: 'Change Password', icon: KeyIcon, action: () => { navigate('/change-password'); setProfileOpen(false); } },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--bg-navbar)] backdrop-blur-xl border-b border-[var(--border-color)]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Menu toggle + Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all lg:block"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <MenuOpenIcon style={{ fontSize: 22 }} />
            ) : (
              <MenuIcon style={{ fontSize: 22 }} />
            )}
          </button>

          {/* Desktop search */}
          {!isMobile && (
            <SearchBar
              placeholder="Search complaints, users..."
              onSearch={(q) => console.log('Search:', q)}
              className="w-64 xl:w-80"
              size="sm"
            />
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Mobile search toggle */}
          {isMobile && (
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
              aria-label="Search"
            >
              {searchOpen ? <CloseIcon style={{ fontSize: 20 }} /> : <SearchIcon style={{ fontSize: 20 }} />}
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <LightModeIcon style={{ fontSize: 20 }} />
            ) : (
              <DarkModeIcon style={{ fontSize: 20 }} />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all relative"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <NotificationsIcon style={{ fontSize: 20 }} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[var(--bg-navbar)]"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[var(--hover-bg)] transition-all"
              aria-label="Profile menu"
              aria-expanded={profileOpen}
            >
              <Avatar name={user?.name} size="sm" />
              {!isMobile && (
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-[var(--text-primary)] leading-tight">{user?.name}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)] capitalize">{user?.role}</p>
                </div>
              )}
            </button>

            {/* Profile dropdown menu */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-[var(--shadow-dropdown)] overflow-hidden z-50"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-[var(--border-color)]">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    {profileMenuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <item.icon style={{ fontSize: 18 }} />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[var(--border-color)] py-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-500/10 transition-colors"
                    >
                      <LogoutIcon style={{ fontSize: 18 }} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && isMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 overflow-hidden"
          >
            <SearchBar
              placeholder="Search complaints, users..."
              onSearch={(q) => console.log('Search:', q)}
              className="w-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
