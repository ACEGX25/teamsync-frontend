import ActivityItem from "./ActivityItem";
import { Archive, Check, Pencil, User } from "lucide-react";

const activities = [
  {
    icon: <Pencil size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />,
    text: "You edited the project",
    highlight: "Q4 Roadmap",
    time: "Just Now",
    color: "var(--color-db-activity-edit)",
  },
  {
    icon: <User size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />,
    text: "Jordan Lee joined",
    highlight: "Engineering Org",
    time: "45 Mins Ago",
    color: "var(--color-db-activity-join)",
  },
  {
    icon: <Archive size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />,
    text: "System archived",
    highlight: "Archive_2022",
    time: "2 Hours Ago",
    color: "var(--color-db-activity-archive)",
  },
  {
    icon: <Check size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />,
    text: "You successfully",
    highlight: "migrated the database.",
    time: "Yesterday",
    color: "var(--color-db-activity-success)",
  },
];

export default function ActivityFeed() {
  return (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: 18,
      padding: 24,
      boxShadow: "0 2px 12px rgba(100,80,160,0.06)",
      border: "1px solid var(--color-divider)",
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 16 }}>
        Activity
      </div>

      {activities.map((a, i) => (
        <ActivityItem
          key={a.time}
          {...a}
          isLast={i === activities.length - 1}
        />
      ))}

      <div style={{ marginTop: 16, textAlign: "center" }}>
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
          View Full History
        </button>
      </div>
    </div>
  );
}