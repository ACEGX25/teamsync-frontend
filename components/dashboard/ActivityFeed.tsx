import ActivityItem from "./ActivityItem";
import { Archive, Check, Clock3, Pencil, User } from "lucide-react";

const activities = [
  {
    icon: <Pencil size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />,
    text: "You edited the project",
    highlight: "Q4 Roadmap",
    time: "Just Now",
    tone: "edit" as const,
  },
  {
    icon: <User size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />,
    text: "Jordan Lee joined",
    highlight: "Engineering Org",
    time: "45 Mins Ago",
    tone: "join" as const,
  },
  {
    icon: <Archive size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />,
    text: "System archived",
    highlight: "Archive_2022",
    time: "2 Hours Ago",
    tone: "archive" as const,
  },
  {
    icon: <Check size={13} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />,
    text: "You successfully",
    highlight: "migrated the database.",
    time: "Yesterday",
    tone: "success" as const,
  },
];

export default function ActivityFeed() {
  return (
    <div className="rounded-[28px] border border-[var(--color-divider)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-db-card)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Activity</p>
          <h3 className="mt-1 text-[16px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">Recent workspace events</h3>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)] shadow-[var(--shadow-db-inset-soft)]">
          <Clock3 size={18} />
        </div>
      </div>

      {activities.map((a, i) => (
        <ActivityItem
          key={a.time}
          {...a}
          isLast={i === activities.length - 1}
        />
      ))}

      <div className="mt-5 text-center">
        <button className="rounded-full border border-[var(--color-brand-xsubtle)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--color-brand-deep)] underline decoration-[var(--color-brand-light)] underline-offset-4 transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-xsubtle)]">
          View Full History
        </button>
      </div>
    </div>
  );
}