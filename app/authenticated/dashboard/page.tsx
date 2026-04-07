import { ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-shield">
          <ShieldCheck size={24} fill="var(--color-brand)" color="white" aria-hidden="true" />
        </div>
        <h1 className="auth-title">You&apos;re in! 🎉</h1>
        <p className="auth-sub">Welcome to your TeamSync dashboard.</p>
      </div>
    </div>
  );
}