/* ============================================
   AuthLayout — split-screen layout for auth pages
   Left: Branding illustration, Right: Form
   ============================================ */
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';

const AuthLayout = () => (
  <div className="min-h-screen flex">
    {/* Left Panel — Branding (hidden on mobile) */}
    <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/5 blur-xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/10 blur-lg" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 ring-1 ring-white/20">
            <SchoolIcon style={{ fontSize: 44 }} />
          </div>

          <h1 className="text-4xl font-bold mb-4">ABES Engineering College</h1>
          <p className="text-xl text-white/80 mb-2">Complaint Management Portal</p>
          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            A unified platform for students, faculty, and administration to submit,
            track, and resolve campus-related issues efficiently.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 justify-center">
            {[
              { value: '2,400+', label: 'Students' },
              { value: '95%', label: 'Resolution Rate' },
              { value: '< 3 days', label: 'Avg. Resolution' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-white/60 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>

    {/* Right Panel — Form content */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-[var(--bg-primary)]">
      <div className="w-full max-w-md">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <SchoolIcon className="text-white" style={{ fontSize: 24 }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">ABES Engineering College</h1>
            <p className="text-xs text-[var(--text-tertiary)]">Complaint Management Portal</p>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
