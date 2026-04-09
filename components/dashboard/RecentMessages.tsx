import MessageItem from "./MessageItem";

const messages = [
  {
    initials: "SJ",
    name: "Sarah Jenkins",
    time: "2m ago",
    preview: "I've uploaded the new brand guidelines to the 'Design' organization. Let me kno...",
    color: "linear-gradient(135deg, var(--color-db-avatar-gradient-start), var(--color-db-avatar-gradient-end))",
    unread: true,
  },
  {
    initials: "MD",
    name: "Marketing Department",
    time: "15m ago",
    preview: "Meeting minutes for the Q4 strategy session are now available in the shared...",
    color: "linear-gradient(135deg, var(--color-db-avatar-green-start), var(--color-db-avatar-green-end))",
  },
  {
    initials: "DC",
    name: "David Chen",
    time: "1h ago",
    preview: "Can we hop on a quick huddle at 2 PM to discuss the API integration challenges?",
    color: "linear-gradient(135deg, var(--color-db-avatar-red-start), var(--color-db-avatar-red-end))",
    unread: true,
  },
];

export default function RecentMessages() {
  return (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: 18,
      padding: 24,
      boxShadow: "0 2px 12px rgba(100,80,160,0.06)",
      border: "1px solid var(--color-divider)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)" }}>
          Recent Messages
        </span>
        <button style={{
          fontSize: 12.5,
          fontWeight: 600,
          color: "var(--color-brand-deep)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          textDecoration: "underline",
          textUnderlineOffset: 2,
        }}>
          View All
        </button>
      </div>

      {messages.map((msg, i) => (
        <MessageItem
          key={msg.name}
          {...msg}
          isLast={i === messages.length - 1}
        />
      ))}
    </div>
  );
}