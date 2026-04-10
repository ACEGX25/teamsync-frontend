import { UpdateProfilePayload, ChangePasswordPayload, ProfileData } from "@/types/profile";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    const newToken = data?.data?.accessToken;
    if (!newToken) return false;
    localStorage.setItem("accessToken", newToken);
    return true;
  } catch {
    return false;
  }
}

async function apiFetch(url: string, options: RequestInit): Promise<Response> {
  let res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) throw new Error("401");
    res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers as Record<string, string>),
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }

  return res;
}

export async function fetchProfile(): Promise<ProfileData> {
  const res = await apiFetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `${res.status}`);
  }

  const json = await res.json();

  // Debug — log raw response so we can see the exact shape
  console.log("[profile] raw response:", json);

  // Backend returns flat: { success, data: { userId, email, fullName, isVerified, createdAt, organizations[] } }
  // Frontend expects:     { login: { userId, email, fullName, isVerified, createdAt }, organizations[] }
  const raw = json.data;
  const { organizations, ...loginFields } = raw;

  return {
    login: loginFields,
    organizations: organizations ?? [],
  };
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<void> {
  const res = await apiFetch(`${API_BASE_URL}/profile`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `${res.status}`);
  }
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  const res = await apiFetch(`${API_BASE_URL}/profile/password`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `${res.status}`);
  }
}