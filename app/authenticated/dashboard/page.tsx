export default function DashboardPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-shield">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" fill="var(--color-brand)" />
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="auth-title">You&apos;re in! 🎉</h1>
        <p className="auth-sub">Welcome to your TeamSync dashboard.</p>
      </div>
    </div>
  );
}