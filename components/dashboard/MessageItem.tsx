interface MessageItemProps {
  initials: string;
  name: string;
  time: string;
  preview: string;
  unread?: boolean;
  color: string;
}

export default function MessageItem({
  initials,
  name,
  time,
  preview,
  unread,
  color,
}: MessageItemProps) {
  return (
    <div className="db-msg-item">
      <div className="db-msg-avatar" style={{ background: color }}>
        {initials}
      </div>
      <div className="db-msg-body">
        <div className="db-msg-header">
          <span className="db-msg-name">{name}</span>
          <span className="db-msg-time">{time}</span>
        </div>
        <p className="db-msg-preview">{preview}</p>
      </div>
      {unread && <span className="db-msg-dot" />}
    </div>
  );
}