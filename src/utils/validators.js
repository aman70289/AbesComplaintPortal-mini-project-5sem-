/* ============================================
   Form validation rules for React Hook Form
   ============================================ */

export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address',
    },
  },

  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Must include uppercase, lowercase, number, and special character',
    },
  },

  confirmPassword: (getValues) => ({
    required: 'Please confirm your password',
    validate: (value) => value === getValues('password') || 'Passwords do not match',
  }),

  required: (fieldName) => ({
    required: `${fieldName} is required`,
  }),

  complaintTitle: {
    required: 'Complaint title is required',
    minLength: { value: 10, message: 'Title must be at least 10 characters' },
    maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
  },

  complaintDescription: {
    required: 'Description is required',
    minLength: { value: 30, message: 'Description must be at least 30 characters' },
    maxLength: { value: 2000, message: 'Description cannot exceed 2000 characters' },
  },

  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: 'Please enter a valid 10-digit phone number',
    },
  },

  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
  },

  otp: {
    required: 'OTP is required',
    pattern: {
      value: /^\d{6}$/,
      message: 'OTP must be 6 digits',
    },
  },
};

/**
 * Get password strength (0-4)
 */
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Weak', color: '#ef4444' },
    { score: 2, label: 'Fair', color: '#f97316' },
    { score: 3, label: 'Good', color: '#f59e0b' },
    { score: 4, label: 'Strong', color: '#10b981' },
  ];

  return levels[score];
};
