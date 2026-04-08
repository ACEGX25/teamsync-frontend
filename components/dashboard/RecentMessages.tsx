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
        color="linear-gradient(135deg,#a78bfa,#7c3aed)"
        unread
      />
      <MessageItem
        initials="MD"
        name="Marketing Department"
        time="15m ago"
        preview="Meeting minutes for the Q4 strategy session are now available in the shared..."
        color="linear-gradient(135deg,#6ee7b7,#059669)"
      />
      <MessageItem
        initials="DC"
        name="David Chen"
        time="1h ago"
        preview="Can we hop on a quick huddle at 2 PM to discuss the API integration challenges?"
        color="linear-gradient(135deg,#fca5a5,#e11d48)"
        unread
      />
    </div>
  );
}