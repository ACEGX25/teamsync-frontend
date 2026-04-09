interface ActivityItemProps {
  icon: React.ReactNode;
  text: string;
  highlight: string;
  time: string;
  tone: "edit" | "join" | "archive" | "success";
  isLast?: boolean;
}

function activityToneClass(tone: ActivityItemProps["tone"]) {
  if (tone === "archive") {
    return "bg-[var(--color-db-activity-archive)]";
  }
  if (tone === "join") {
    return "bg-[var(--color-db-activity-join)]";
  }
  if (tone === "success") {
    return "bg-[var(--color-db-activity-success)]";
  }
  return "bg-[var(--color-db-activity-edit)]";
}

export default function ActivityItem({
  icon,
  text,
  highlight,
  time,
  tone,
  isLast,
}: ActivityItemProps) {
  return (
    <div className={`flex items-start gap-3 py-3 ${isLast ? "border-b-0" : "border-b border-[var(--color-db-msg-divider)]"}`}>
      <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl shadow-[var(--shadow-db-icon)] ${activityToneClass(tone)}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="m-0 text-[12.5px] leading-[1.45] text-[var(--color-db-act-text)]">
          {text}{" "}
          <span className="font-semibold text-[var(--color-brand-deep)]">
            {highlight}
          </span>
        </p>
        <p className="mt-0.5 text-[11px] uppercase tracking-[0.5px] text-[var(--color-db-msg-time)]">
          {time}
        </p>
      </div>
    </div>
  );
}