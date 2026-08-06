/* ============================================
   ForgotPasswordPage — send OTP to email
   ============================================ */
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { forgotPassword } from '@/services/authService';
import { validationRules } from '@/utils/validators';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset';
import { ROUTES } from '@/utils/constants';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      toast.success('OTP sent to your email!');
      navigate(ROUTES.OTP_VERIFICATION, { state: { email: data.email } });
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
        <LockResetIcon className="text-primary-600" style={{ fontSize: 28 }} />
      </div>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Forgot Password?</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        No worries! Enter your registered email and we'll send you a verification code.
      </p>

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

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Send Verification Code
        </Button>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordPage;
