import StatCard from "./StatCard";
import { Users, MessageSquare, GitBranch, Zap } from "lucide-react";

const stats = [
  {
    Icon: Users,
    iconClass: "text-[var(--color-db-stats-members-icon)]",
    iconBgClass: "bg-[var(--color-db-stats-members-bg)]",
    label: "ACTIVE",
    sublabel: "MEMBERS",
    value: "1,284",
  },
  {
    Icon: MessageSquare,
    iconClass: "text-[var(--color-db-stats-messages-icon)]",
    iconBgClass: "bg-[var(--color-db-stats-messages-bg)]",
    label: "DAILY",
    sublabel: "MESSAGES",
    value: "15.4k",
  },
  {
    Icon: GitBranch,
    iconClass: "text-[var(--color-db-stats-integrations-icon)]",
    iconBgClass: "bg-[var(--color-db-stats-integrations-bg)]",
    label: "INTEGRATIONS",
    sublabel: "",
    value: "42",
  },
  {
    Icon: Zap,
    iconClass: "text-[var(--color-db-stats-sync-icon)]",
    iconBgClass: "bg-[var(--color-db-stats-sync-bg)]",
    label: "SYNC",
    sublabel: "SPEED",
    value: "99.8%",
  },
];

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <StatCard
          key={s.label + s.sublabel}
          icon={<s.Icon size={20} strokeWidth={2} className={s.iconClass} />}
          iconBgClass={s.iconBgClass}
          label={s.label}
          sublabel={s.sublabel}
          value={s.value}
        />
      ))}
    </div>
  );
}