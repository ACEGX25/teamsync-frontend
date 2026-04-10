// ── Mapped from Login model ──────────────────────────────
export interface LoginProfile {
  userId: number;
  email: string;
  fullName: string;
  isVerified: boolean;
  createdAt: string; // ISO string from API
}

// ── Mapped from Organization + User join ─────────────────
export interface UserOrganization {
  orgId: number;
  orgName: string;
  createdAt: string; // org createdAt
  isActive: boolean; // from User.isActive
}

// ── Full profile response shape from API ─────────────────
export interface ProfileData {
  login: LoginProfile;
  organizations: UserOrganization[];
}

// ── Update profile request body ──────────────────────────
export interface UpdateProfilePayload {
  fullName: string;
  email: string;
}

// ── Change password request body ─────────────────────────
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}