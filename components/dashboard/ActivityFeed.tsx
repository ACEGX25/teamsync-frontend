import ActivityItem from "./ActivityItem";

export default function ActivityFeed() {
  return (
    <div className="db-card">
      <div className="db-card-title">Activity</div>

      <ActivityItem
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        }
        text="You edited the project"
        highlight="Q4 Roadmap"
        time="Just Now"
        color="#8b5cf6"
      />
      <ActivityItem
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        }
        text="Jordan Lee joined"
        highlight="Engineering Org"
        time="45 Mins Ago"
        color="#3b82f6"
      />
      <ActivityItem
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
        }
        text="System archived"
        highlight="Archive_2022"
        time="2 Hours Ago"
        color="#f59e0b"
      />
      <ActivityItem
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
        text="You successfully"
        highlight="migrated the database."
        time="Yesterday"
        color="#10b981"
      />

      <div className="db-act-footer">
        <button>View Full History</button>
      </div>
    </div>
  );
}