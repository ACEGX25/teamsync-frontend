// utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";


interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginResponseData {
  user: AuthUser;
  accessToken: string;
}

interface MeResponseData {
  user: AuthUser;
}

const persistUserSession = (payload?: LoginResponseData) => {
  if (typeof window === "undefined" || !payload) return;
  localStorage.setItem("accessToken", payload.accessToken);
  localStorage.setItem("userName", payload.user.fullName);
  localStorage.setItem("userEmail", payload.user.email);
  localStorage.setItem("userDetails", JSON.stringify(payload.user));
};

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authApi = {
  // Step 1: Initiate registration (send OTP to email)
  initiateRegister: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    const data: ApiResponse<unknown> = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  },

  // Step 2: Verify OTP
  verifyRegisterOtp: async (email: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-register-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });
    const data: ApiResponse<unknown> = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }
    return data;
  },

  // Step 3: Complete registration (set name + password)
  completeRegister: async (email: string, fullName: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/complete-register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, fullName, password }),
      credentials: "include",
    });
    const data: ApiResponse<unknown> = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration completion failed");
    }
    return data;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data: ApiResponse<LoginResponseData> = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    persistUserSession(data.data);
    return data;
  },

  // Current logged-in user
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data: ApiResponse<MeResponseData> = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user details");
    }

    if (typeof window !== "undefined" && data.data?.user) {
      localStorage.setItem("userName", data.data.user.fullName);
      localStorage.setItem("userEmail", data.data.user.email);
      localStorage.setItem("userDetails", JSON.stringify(data.data.user));
    }

    return data;
  },

  // Forgot password Step 1: send OTP
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

  // Forgot password Step 2: verify OTP and return reset token
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

  // Forgot password Step 3: reset password
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
