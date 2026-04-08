import StatCard from "./StatCard";

export default function StatsRow() {
  return (
    <div className="db-stats-row">
      <StatCard
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        }
        label="ACTIVE"
        sublabel="MEMBERS"
        value="1,284"
        color="#f0ebff"
      />
      <StatCard
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        }
        label="DAILY"
        sublabel="MESSAGES"
        value="15.4k"
        color="#ecfdf5"
      />
      <StatCard
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="5" r="3" />
            <circle cx="5" cy="19" r="3" />
            <circle cx="19" cy="19" r="3" />
            <line x1="12" y1="8" x2="5" y2="16" />
            <line x1="12" y1="8" x2="19" y2="16" />
          </svg>
        }
        label="INTEGRATIONS"
        sublabel=""
        value="42"
        color="#f5f3ff"
      />
      <StatCard
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round">
            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        }
        label="SYNC"
        sublabel="SPEED"
        value="99.8%"
        color="#f0f9ff"
      />
    </div>
  );
}