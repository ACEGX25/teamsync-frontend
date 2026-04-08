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

  //Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    // Cleanup local storage regardless of response success
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userDetails");
    }

    if (!response.ok) {
      const data: ApiResponse<unknown> = await response.json();
      throw new Error(data.message || "Logout failed");
    }
    
    return true;
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
};
