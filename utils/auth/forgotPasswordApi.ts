// utils/auth/forgotPasswordApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const forgotPasswordApi = {
  // Step 1: send OTP
  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    const data: ApiResponse<unknown> = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }
    return data;
  },

  // Step 2: verify OTP and return reset token
  verifyForgotOtp: async (email: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-forgot-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });
    const data: ApiResponse<{ resetToken: string }> = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }
    return data;
  },

  // Step 3: reset password
  resetPassword: async (resetToken: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword }),
      credentials: "include",
    });
    const data: ApiResponse<unknown> = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Password reset failed");
    }
    return data;
  },
};
