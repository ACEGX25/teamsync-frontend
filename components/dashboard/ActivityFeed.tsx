import ActivityItem from "./ActivityItem";
import { Archive, Check, Pencil, User } from "lucide-react";

export default function ActivityFeed() {
  return (
    <div className="db-card">
      <div className="db-card-title">Activity</div>

      <ActivityItem
        icon={<Pencil size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />}
        text="You edited the project"
        highlight="Q4 Roadmap"
        time="Just Now"
        color="var(--color-db-activity-edit)"
      />
      <ActivityItem
        icon={<User size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />}
        text="Jordan Lee joined"
        highlight="Engineering Org"
        time="45 Mins Ago"
        color="var(--color-db-activity-join)"
      />
      <ActivityItem
        icon={<Archive size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />}
        text="System archived"
        highlight="Archive_2022"
        time="2 Hours Ago"
        color="var(--color-db-activity-archive)"
      />
      <ActivityItem
        icon={<Check size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />}
        text="You successfully"
        highlight="migrated the database."
        time="Yesterday"
        color="var(--color-db-activity-success)"
      />

      <div className="db-act-footer">
        <button>View Full History</button>
      </div>
    </div>
  );
}