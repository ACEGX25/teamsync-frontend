interface ActivityItemProps {
  icon: React.ReactNode;
  text: string;
  highlight: string;
  time: string;
  color: string;
  isLast?: boolean;
}

export default function ActivityItem({
  icon,
  text,
  highlight,
  time,
  color,
  isLast,
}: ActivityItemProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "10px 0",
      borderBottom: isLast ? "none" : "1px solid var(--color-db-msg-divider)",
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: color,
      }}>
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12.5, color: "var(--color-db-act-text)", lineHeight: 1.4, margin: 0 }}>
          {text}{" "}
          <span style={{ fontWeight: 600, color: "var(--color-brand-deep)" }}>
            {highlight}
          </span>
        </p>
        <p style={{
          fontSize: 11,
          color: "var(--color-db-msg-time)",
          marginTop: 2,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          margin: "2px 0 0",
        }}>
          {time}
        </p>
      </div>
    </div>
  );
}