// utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";


interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const authApi = {
  // Step 1: Initiate registration (send OTP to email)
  initiateRegister: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    const data: ApiResponse<any> = await response.json();
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
    const data: ApiResponse<any> = await response.json();
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
    const data: ApiResponse<any> = await response.json();
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
    const data: ApiResponse<any> = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data;
  },
};
