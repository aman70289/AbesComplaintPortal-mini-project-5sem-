/* ============================================
   Auth Service — mock implementation
   Swap with real API calls for production
   ============================================ */
import { mockUsers } from './mockData';

// Simulated network delay
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Login with email/password and role
 * In production, the role comes from the backend response
 */
export const loginUser = async ({ email, password, role = 'student' }) => {
  await delay(1000);

  // Demo: accept any non-empty credentials
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = mockUsers[role];
  if (!user) {
    throw new Error('Invalid role selected');
  }

  // Simulate JWT token
  const token = `mock-jwt-token-${role}-${Date.now()}`;

  return {
    success: true,
    data: {
      user: { ...user, email },
      token,
    },
    message: 'Login successful',
  };
};

/**
 * Forgot password — send OTP to email
 */
export const forgotPassword = async (email) => {
  await delay(1000);
  if (!email) throw new Error('Email is required');

  return {
    success: true,
    message: 'OTP sent to your registered email address',
  };
};

/**
 * Verify OTP
 */
export const verifyOTP = async (email, otp) => {
  await delay(800);
  // Demo: accept "123456" as valid OTP
  if (otp === '123456') {
    return {
      success: true,
      message: 'OTP verified successfully',
      data: { resetToken: `reset-token-${Date.now()}` },
    };
  }
  throw new Error('Invalid OTP. Please try again.');
};

/**
 * Reset password
 */
export const resetPassword = async (resetToken, newPassword) => {
  await delay(800);
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  return {
    success: true,
    message: 'Password reset successfully. Please login with your new password.',
  };
};

/**
 * Change password (while logged in)
 */
export const changePassword = async (currentPassword, newPassword) => {
  await delay(800);
  if (!currentPassword) throw new Error('Current password is required');
  if (!newPassword || newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters');
  }
  return {
    success: true,
    message: 'Password changed successfully',
  };
};

/**
 * Logout
 */
export const logoutUser = async () => {
  await delay(300);
  return { success: true };
};
