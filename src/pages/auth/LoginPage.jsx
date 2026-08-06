/* ============================================
   LoginPage — email/password with role selector
   ============================================ */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { validationRules } from '@/utils/validators';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { USER_ROLES, ROUTES } from '@/utils/constants';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('student');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: localStorage.getItem('rememberedEmail') || '',
      password: '',
      rememberMe: !!localStorage.getItem('rememberedEmail'),
    },
  });

  const roleRedirects = {
    student: ROUTES.STUDENT_DASHBOARD,
    faculty: ROUTES.FACULTY_DASHBOARD,
    coordinator: ROUTES.COORDINATOR_DASHBOARD,
    admin: ROUTES.ADMIN_DASHBOARD,
  };

  const onSubmit = async (data) => {
    try {
      await login({ ...data, role: selectedRole });
      navigate(roleRedirects[selectedRole]);
    } catch {
      // Error handled by AuthContext toast
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Sign in to your account to continue</p>
      </div>

      {/* Role Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Login as</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(USER_ROLES).map(([key, role]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedRole(key)}
              className={`
                px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200
                ${selectedRole === key
                  ? 'border-primary-600 bg-primary-600/10 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg)]'
                }
              `}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@abes.ac.in"
          icon={EmailIcon}
          required
          error={errors.email?.message}
          {...register('email', validationRules.email)}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          icon={LockIcon}
          required
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[var(--border-color)] text-primary-600 focus:ring-primary-500 cursor-pointer"
              {...register('rememberMe')}
            />
            <span className="text-sm text-[var(--text-secondary)]">Remember me</span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      {/* Demo credentials hint */}
      <div className="mt-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">Demo Mode</p>
        <p className="text-xs text-[var(--text-tertiary)]">
          Enter any email and password, then select a role to explore the portal.
          Try all 4 roles for the complete experience.
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
