// utils/api.ts
import Cookies from 'js-cookie'

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

export interface Organization {
  orgId(orgId: (arg0: string, orgId: any) => unknown): unknown;
  orgId(arg0: string, orgId: any): unknown;
  id: number;
  orgName: string;
  memberCount?: number;
  createdAt?: string;
}

export interface OrgMember {
  id: number;
  userId: number;
  orgId: number;
  isActive: boolean;
  login: {
    userId: number;
    fullName: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
  };
}

const persistUserSession = (payload?: LoginResponseData) => {
  if (typeof window === "undefined" || !payload) return;
  // existing localStorage
  localStorage.setItem("accessToken", payload.accessToken);
  localStorage.setItem("userName", payload.user.fullName);
  localStorage.setItem("userEmail", payload.user.email);
  localStorage.setItem("userDetails", JSON.stringify(payload.user));
  // add cookie so middleware can read it
  Cookies.set("token", payload.accessToken, { expires: 7 })
};


const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authApi = {
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

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    // clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userDetails");
    }
    // clear cookie so middleware blocks access immediately
    Cookies.remove("token")

    if (!response.ok) {
      const data: ApiResponse<unknown> = await response.json();
      throw new Error(data.message || "Logout failed");
    }

    return true;
  },

getMe: async () => {
  const response = await apiFetch(`${API_BASE_URL}/auth/me`);
  const data: ApiResponse<MeResponseData> = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch user details");

  if (typeof window !== "undefined" && data.data?.user) {
    localStorage.setItem("userName", data.data.user.fullName);
    localStorage.setItem("userEmail", data.data.user.email);
    localStorage.setItem("userDetails", JSON.stringify(data.data.user));
  }
  return data;
},

 deleteOrganization: async (orgId: number): Promise<void> => {
    const response = await apiFetch(`${API_BASE_URL}/organizations/${orgId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to delete organization");
  },
};



export const orgApi = {
  getMyOrganizations: async (): Promise<Organization[]> => {
    const response = await apiFetch(`${API_BASE_URL}/organizations`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch organizations");
    return data;
  },

  createOrganization: async (orgName: string): Promise<Organization> => {
    const response = await apiFetch(`${API_BASE_URL}/organizations`, {
      method: "POST",
      body: JSON.stringify({ orgName }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to create organization");
    return data;
  },

  deleteOrganization: async (orgId: number): Promise<void> => {
    const response = await apiFetch(`${API_BASE_URL}/organizations/${orgId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to delete organization");
  },

  getMembers: async (orgId: number): Promise<OrgMember[]> => {
    const response = await apiFetch(`${API_BASE_URL}/organizations/${orgId}/members`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch members");
    return data ?? [];
  },

  addMember: async (orgId: number, email: string) => {
    const response = await apiFetch(`${API_BASE_URL}/organizations/${orgId}/members`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to add member");
    return data;
  },
};



const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // sends refresh token cookie
    });
    const data = await response.json();
    if (!response.ok) return null;

    const newToken = data.data?.accessToken || data.accessToken;
    if (newToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", newToken);
      Cookies.set("token", newToken, { expires: 7 });
    }
    return newToken;
  } catch {
    return null;
  }
};

export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
    credentials: "include",
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // Refresh also failed — redirect to login
      if (typeof window !== "undefined") {
        localStorage.clear();
        Cookies.remove("token");
        window.location.href = "/login";
      }
      return response;
    }

    // Retry original request with new token
    return fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      credentials: "include",
    });
  }

  return response;
};

