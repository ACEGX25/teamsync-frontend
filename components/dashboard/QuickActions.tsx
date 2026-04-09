import { Video, Building2 } from "lucide-react";

export default function QuickActions() {
  const btnBase: React.CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 18px",
    borderRadius: 12,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    marginBottom: 10,
    transition: "opacity 0.2s, transform 0.15s",
  };

  const hoverOn  = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity   = "0.88";
    e.currentTarget.style.transform = "translateY(-1px)";
  };
  const hoverOff = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity   = "1";
    e.currentTarget.style.transform = "translateY(0)";
  };

  return (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: 18,
      padding: 24,
      boxShadow: "0 2px 12px rgba(100,80,160,0.06)",
      border: "1px solid var(--color-divider)",
    }}>

      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 16 }}>
        Quick Actions
      </div>

      {/* Primary button */}
      <button
        style={{ ...btnBase, background: "var(--color-db-qa-primary-bg)", color: "var(--color-db-qa-primary-text)" }}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          background: "var(--color-db-quick-icon-primary-bg)",
        }}>
          <Video size={17} />
        </div>
        Start a Meeting
      </button>

      {/* Secondary button */}
      <button
        style={{ ...btnBase, background: "var(--color-db-qa-secondary-bg)", color: "var(--color-db-qa-secondary-text)", border: "1.5px solid var(--color-input-border)" }}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          background: "var(--color-db-quick-icon-secondary-bg)",
        }}>
          <Building2 size={17} />
        </div>
        Create Organization
      </button>

      {/* Upcoming */}
      <div style={{ marginTop: 16 }}>
        <p style={{
          fontSize: 10.5, fontWeight: 700, letterSpacing: 1,
          color: "var(--color-db-upcoming-label)", textTransform: "uppercase", marginBottom: 10,
        }}>
          Upcoming Next
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 14px",
          background: "var(--color-db-upcoming-bg)",
          borderRadius: 12,
          border: "1px solid var(--color-divider)",
        }}>
          <div style={{
            width: 3, height: 36, borderRadius: 99,
            background: "var(--color-brand-gradient)",
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
              Product Sync
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
              10:30 AM – 11:15 AM
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}