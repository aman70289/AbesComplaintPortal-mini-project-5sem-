/* ============================================
   ResetPasswordPage — set new password
   ============================================ */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { resetPassword } from '@/services/authService';
import { validationRules, getPasswordStrength } from '@/utils/validators';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShieldIcon from '@mui/icons-material/Shield';
import { ROUTES } from '@/utils/constants';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken;
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm();
  const passwordValue = watch('password', '');
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await resetPassword(resetToken, data.password);
      toast.success('Password reset successfully!');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary-600 transition-colors mb-6"
      >
        <ArrowBackIcon style={{ fontSize: 18 }} />
        Back to Login
      </Link>

      <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-6">
        <ShieldIcon className="text-primary-600" style={{ fontSize: 28 }} />
      </div>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Set New Password</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        Create a strong password for your account. Make sure it's at least 8 characters long.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password"
            icon={LockIcon}
            required
            error={errors.password?.message}
            {...register('password', validationRules.password)}
          />

          {/* Password strength meter */}
          {passwordValue && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: level <= strength.score ? strength.color : 'var(--border-color)',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          icon={LockIcon}
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', validationRules.confirmPassword(getValues))}
        />

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Reset Password
        </Button>
      </form>
    </motion.div>
  );
};

export default ResetPasswordPage;
