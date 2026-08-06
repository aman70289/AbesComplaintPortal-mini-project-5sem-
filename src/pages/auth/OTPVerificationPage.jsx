/* ============================================
   OTPVerificationPage — 6-digit OTP input
   ============================================ */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { verifyOTP, forgotPassword } from '@/services/authService';
import Button from '@/components/common/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { ROUTES } from '@/utils/constants';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(email, code);
      toast.success('Code verified successfully!');
      navigate(ROUTES.RESET_PASSWORD, { state: { resetToken: response.data.resetToken } });
    } catch (err) {
      toast.error(err.message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await forgotPassword(email);
      toast.success('New code sent!');
      setResendTimer(30);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        to={ROUTES.FORGOT_PASSWORD}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary-600 transition-colors mb-6"
      >
        <ArrowBackIcon style={{ fontSize: 18 }} />
        Back
      </Link>

      <div className="w-14 h-14 rounded-2xl bg-success-500/10 flex items-center justify-center mb-6">
        <MarkEmailReadIcon className="text-success-500" style={{ fontSize: 28 }} />
      </div>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Verify Your Email</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        We've sent a 6-digit code to <span className="font-medium text-[var(--text-primary)]">{email || 'your email'}</span>.
        Enter it below to continue.
      </p>

      {/* OTP Input Grid */}
      <div className="flex gap-3 justify-center mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className={`
              w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200
              bg-[var(--input-bg)] text-[var(--text-primary)]
              focus:outline-none
              ${digit
                ? 'border-primary-500 ring-2 ring-primary-500/20'
                : 'border-[var(--border-color)] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
              }
            `}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>

      <Button
        fullWidth
        size="lg"
        loading={loading}
        onClick={handleVerify}
        disabled={otp.some((d) => !d)}
      >
        Verify Code
      </Button>

      {/* Resend */}
      <div className="text-center mt-6">
        {resendTimer > 0 ? (
          <p className="text-sm text-[var(--text-tertiary)]">
            Resend code in <span className="font-medium text-[var(--text-primary)]">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Didn't receive the code? Resend
          </button>
        )}
      </div>

      {/* Hint */}
      <div className="mt-6 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <p className="text-xs text-[var(--text-tertiary)]">
          💡 Demo: Enter <span className="font-mono font-medium text-[var(--text-primary)]">123456</span> as the verification code.
        </p>
      </div>
    </motion.div>
  );
};

export default OTPVerificationPage;
