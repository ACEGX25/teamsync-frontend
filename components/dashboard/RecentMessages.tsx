import MessageItem from "./MessageItem";

export default function RecentMessages() {
  return (
    <div className="db-card">
      <div className="db-msg-header-row">
        <span className="db-card-title" style={{ marginBottom: 0 }}>
          Recent Messages
        </span>
        <button className="db-view-all">View All</button>
      </div>

      <MessageItem
        initials="SJ"
        name="Sarah Jenkins"
        time="2m ago"
        preview="I've uploaded the new brand guidelines to the 'Design' organization. Let me kno..."
        color="linear-gradient(135deg, var(--color-db-avatar-gradient-start), var(--color-db-avatar-gradient-end))"
        unread
      />
      <MessageItem
        initials="MD"
        name="Marketing Department"
        time="15m ago"
        preview="Meeting minutes for the Q4 strategy session are now available in the shared..."
        color="linear-gradient(135deg, var(--color-db-avatar-green-start), var(--color-db-avatar-green-end))"
      />
      <MessageItem
        initials="DC"
        name="David Chen"
        time="1h ago"
        preview="Can we hop on a quick huddle at 2 PM to discuss the API integration challenges?"
        color="linear-gradient(135deg, var(--color-db-avatar-red-start), var(--color-db-avatar-red-end))"
        unread
      />
    </div>
  );
}