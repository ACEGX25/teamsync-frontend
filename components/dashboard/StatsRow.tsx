import StatCard from "./StatCard";
import { Users, MessageSquare, GitBranch, Zap } from "lucide-react";

export default function StatsRow() {
  return (
    <div className="db-stats-row">
      <StatCard
        icon={<Users size={20} color="var(--color-db-stats-members-icon)" strokeWidth={2} />}
        label="ACTIVE"
        sublabel="MEMBERS"
        value="1,284"
        color="var(--color-db-stats-members-bg)"
      />
      <StatCard
        icon={<MessageSquare size={20} color="var(--color-db-stats-messages-icon)" strokeWidth={2} />}
        label="DAILY"
        sublabel="MESSAGES"
        value="15.4k"
        color="var(--color-db-stats-messages-bg)"
      />
      <StatCard
        icon={<GitBranch size={20} color="var(--color-db-stats-integrations-icon)" strokeWidth={2} />}
        label="INTEGRATIONS"
        sublabel=""
        value="42"
        color="var(--color-db-stats-integrations-bg)"
      />
      <StatCard
        icon={<Zap size={20} color="var(--color-db-stats-sync-icon)" strokeWidth={2} />}
        label="SYNC"
        sublabel="SPEED"
        value="99.8%"
        color="var(--color-db-stats-sync-bg)"
      />
    </div>
  );
}