"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import ProfileHero from "./ProfileHero";
import PersonalInfoSection from "./PersonalInfoSection";
import OrganizationsSection from "./Organizationssection ";
import ChangePasswordSection from "./Changepasswordsection";
import { ProfileData, LoginProfile } from "@/types/profile";
import { fetchProfile, updateProfile } from "@/utils/profileApi";

type ToastType = "success" | "error" | null;

export default function ProfilePageClient() {
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: ToastType; message: string }>({
    type: null,
    message: "",
  });

  const [editLogin, setEditLogin] = useState<Pick<LoginProfile, "fullName" | "email">>({
    fullName: "",
    email: "",
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: null, message: "" }), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    fetchProfile()
      .then((d) => {
        setData(d);
        setEditLogin({ fullName: d.login.fullName, email: d.login.email });
      })
      .catch((err: Error) => {
        if (
          err.message.includes("401") ||
          err.message.toLowerCase().includes("unauthorized")
        ) {
          router.replace("/auth/login");
          return;
        }
        setError("Failed to load profile. Please refresh.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleFieldChange = (
    field: keyof Pick<LoginProfile, "fullName" | "email">,
    value: string
  ) => {
    setEditLogin((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile(editLogin);
      setData((prev) =>
        prev ? { ...prev, login: { ...prev.login, ...editLogin } } : prev
      );
      showToast("success", "Profile saved successfully");
    } catch {
      showToast("error", "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="min-h-full flex items-center justify-center"
        style={{ background: "var(--color-bg-dashboard)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 rounded-full border-4 animate-spin"
            style={{
              borderColor: "var(--color-brand-subtle)",
              borderTopColor: "var(--color-brand)",
            }}
          />
          <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div
        className="min-h-full flex items-center justify-center"
        style={{ background: "var(--color-bg-dashboard)" }}
      >
        <div
          className="rounded-2xl px-8 py-6 text-center"
          style={{
            background: "var(--color-error-bg)",
            border: "1px solid var(--color-error-border)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--color-error)" }}>
            {error || "Something went wrong."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--color-brand)", border: "none", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const mergedLogin = { ...data.login, ...editLogin };

  return (
    <div
      className="min-h-full"
      style={{ background: "var(--color-bg-dashboard)", fontFamily: "var(--font-base)" }}
    >
      {/* ── Toast ──────────────────────────────────────────── */}
      {toast.type && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg"
          style={{
            background:
              toast.type === "success" ? "rgba(16,185,129,0.1)" : "var(--color-error-bg)",
            border: `1px solid ${
              toast.type === "success" ? "rgba(16,185,129,0.25)" : "var(--color-error-border)"
            }`,
            color: toast.type === "success" ? "#059669" : "var(--color-error)",
            backdropFilter: "blur(8px)",
            animation: "fadeInDown 0.2s ease",
          }}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <ProfileHero login={mergedLogin} onSave={handleSave} saving={saving} />

      <div className="flex items-start gap-6 p-6">
        {/* Left column */}
        <div className="flex flex-1 min-w-0 flex-col gap-5">
          <PersonalInfoSection login={mergedLogin} onChange={handleFieldChange} />
          <OrganizationsSection organizations={data.organizations} />
          <ChangePasswordSection />
        </div>

        {/* Right column — account overview only */}
        <aside className="flex flex-col gap-4" style={{ width: 260, minWidth: 260 }}>
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-divider)",
              boxShadow: "var(--shadow-db-card)",
            }}
          >
            <p
              className="text-[0.68rem] font-bold tracking-widest mb-3"
              style={{ color: "var(--color-brand)" }}
            >
              ACCOUNT
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: "User ID", value: `#${data.login.userId}` },
                {
                  label: "Member Since",
                  value: new Date(data.login.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                },
                {
                  label: "Organizations",
                  value: `${data.organizations.length} workspace${
                    data.organizations.length !== 1 ? "s" : ""
                  }`,
                },
                {
                  label: "Active Orgs",
                  value: `${data.organizations.filter((o) => o.isActive).length} active`,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[0.78rem]" style={{ color: "var(--color-text-muted)" }}>
                    {label}
                  </span>
                  <span
                    className="text-[0.78rem] font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}