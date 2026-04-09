import StatCard from "./StatCard";
import { Users, MessageSquare, GitBranch, Zap } from "lucide-react";

const stats = [
  {
    icon: <Users size={20} strokeWidth={2} color="var(--color-db-stats-members-icon)" />,
    iconBg: "var(--color-db-stats-members-bg)",
    label: "ACTIVE",
    sublabel: "MEMBERS",
    value: "1,284",
  },
  {
    icon: <MessageSquare size={20} strokeWidth={2} color="var(--color-db-stats-messages-icon)" />,
    iconBg: "var(--color-db-stats-messages-bg)",
    label: "DAILY",
    sublabel: "MESSAGES",
    value: "15.4k",
  },
  {
    icon: <GitBranch size={20} strokeWidth={2} color="var(--color-db-stats-integrations-icon)" />,
    iconBg: "var(--color-db-stats-integrations-bg)",
    label: "INTEGRATIONS",
    sublabel: "",
    value: "42",
  },
  {
    icon: <Zap size={20} strokeWidth={2} color="var(--color-db-stats-sync-icon)" />,
    iconBg: "var(--color-db-stats-sync-bg)",
    label: "SYNC",
    sublabel: "SPEED",
    value: "99.8%",
  },
];

export default function StatsRow() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
    }}>
      {stats.map((s) => (
        <StatCard
          key={s.label + s.sublabel}
          icon={s.icon}
          iconBg={s.iconBg}
          label={s.label}
          sublabel={s.sublabel}
          value={s.value}
        />
      ))}
    </div>
  );
}