/* ============================================
   SettingsPage — app settings
   ============================================ */
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockIcon from '@mui/icons-material/Lock';
import LanguageIcon from '@mui/icons-material/Language';
import SecurityIcon from '@mui/icons-material/Security';

const SettingRow = ({ icon: Icon, title, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-[var(--border-color)] last:border-b-0">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary-600/10 flex items-center justify-center shrink-0">
        <Icon className="text-primary-600" style={{ fontSize: 18 }} />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        {description && <p className="text-xs text-[var(--text-tertiary)]">{description}</p>}
      </div>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
      checked ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
    }`}
    role="switch"
    aria-checked={checked}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
      checked ? 'translate-x-5' : ''
    }`} />
  </button>
);

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>

      {/* Appearance */}
      <Card>
        <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Appearance</h3>
        <SettingRow
          icon={isDark ? DarkModeIcon : LightModeIcon}
          title="Dark Mode"
          description="Switch between light and dark theme"
        >
          <Toggle checked={isDark} onChange={toggleTheme} />
        </SettingRow>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Notifications</h3>
        <SettingRow icon={NotificationsIcon} title="Email Notifications" description="Receive email updates for complaint status changes">
          <Toggle checked={true} onChange={() => toast.success('Setting updated')} />
        </SettingRow>
        <SettingRow icon={NotificationsIcon} title="Push Notifications" description="Browser push notifications for new updates">
          <Toggle checked={false} onChange={() => toast.success('Setting updated')} />
        </SettingRow>
      </Card>

      {/* Security */}
      <Card>
        <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Security</h3>
        <SettingRow icon={LockIcon} title="Change Password" description="Update your account password">
          <Button variant="outline" size="sm">Change</Button>
        </SettingRow>
        <SettingRow icon={SecurityIcon} title="Two-Factor Authentication" description="Add an extra layer of security">
          <Toggle checked={false} onChange={() => toast.success('2FA settings updated')} />
        </SettingRow>
      </Card>

      {/* Language */}
      <Card>
        <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Language & Region</h3>
        <SettingRow icon={LanguageIcon} title="Language" description="Select your preferred language">
          <select className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </SettingRow>
      </Card>
    </div>
  );
};

export default SettingsPage;
