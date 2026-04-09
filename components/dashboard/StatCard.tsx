interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  value: string;
  iconBg: string;
}

export default function StatCard({ icon, label, sublabel, value, iconBg }: StatCardProps) {
  return (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: 16,
      padding: 20,
      display: "flex",
      alignItems: "center",
      gap: 14,
      boxShadow: "0 2px 12px rgba(100,80,160,0.06)",
      border: "1px solid var(--color-divider)",
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: iconBg,
      }}>
        {icon}
      </div>

      <div>
        <p style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: 0.8,
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          lineHeight: 1.4,
          margin: 0,
        }}>
          {label}
          {sublabel && <span style={{ display: "block" }}>{sublabel}</span>}
        </p>
        <p style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--color-text-primary)",
          letterSpacing: -0.5,
          marginTop: 2,
          margin: "2px 0 0",
        }}>
          {value}
        </p>
      </div>
    </div>
  );
}