interface MessageItemProps {
  initials: string;
  name: string;
  time: string;
  preview: string;
  unread?: boolean;
  color: string;
  isLast?: boolean;
}

export default function MessageItem({
  initials,
  name,
  time,
  preview,
  unread,
  color,
  isLast,
}: MessageItemProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "12px 0",
      borderBottom: isLast ? "none" : "1px solid var(--color-db-msg-divider)",
      position: "relative",
    }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "var(--color-db-icon-on-color)",
        flexShrink: 0,
        background: color,
      }}>
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
            {name}
          </span>
          <span style={{ fontSize: 11, color: "var(--color-db-msg-time)", whiteSpace: "nowrap" }}>
            {time}
          </span>
        </div>
        <p style={{
          fontSize: 12.5,
          color: "var(--color-text-secondary)",
          lineHeight: 1.45,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          margin: 0,
        }}>
          {preview}
        </p>
      </div>

      {unread && (
        <span style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--color-brand-deep)",
          flexShrink: 0,
          marginTop: 14,
        }} />
      )}
    </div>
  );
}