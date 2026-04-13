interface MessageItemProps {
  initials: string;
  name: string;
  time: string;
  preview: string;
  unread?: boolean;
  tone: "violet" | "green" | "red";
  isLast?: boolean;
}

function avatarToneClass(tone: MessageItemProps["tone"]) {
  if (tone === "green") return "from-[var(--color-db-avatar-green-start)] to-[var(--color-db-avatar-green-end)]";
  if (tone === "red") return "from-[var(--color-db-avatar-red-start)] to-[var(--color-db-avatar-red-end)]";
  return "from-[var(--color-db-avatar-gradient-start)] to-[var(--color-db-avatar-gradient-end)]";
}

export default function MessageItem({
  initials,
  name,
  time,
  preview,
  unread,
  tone,
  isLast,
}: MessageItemProps) {
  return (
    <div className={`group relative flex items-start gap-3 py-3 ${isLast ? "border-b-0" : "border-b border-[var(--color-db-msg-divider)]"}`}>
      <div
        className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-gradient-to-br ${avatarToneClass(tone)} text-[12px] font-bold text-[var(--color-db-icon-on-color)] shadow-[var(--shadow-db-icon-strong)] ring-1 ring-[var(--color-white-soft-70)]`}
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-[13.5px] font-semibold tracking-[-0.2px] text-[var(--color-text-primary)]">
            {name}
          </span>
          <span className="whitespace-nowrap text-[11px] text-[var(--color-db-msg-time)]">
            {time}
          </span>
        </div>
        <p
          className="m-0 overflow-hidden text-[12.5px] leading-[1.5] text-[var(--color-text-secondary)] [display:-webkit-box] [WebkitBoxOrient:vertical] [WebkitLineClamp:2]"
        >
          {preview}
        </p>
      </div>

      {unread && (
        <span className="mt-[14px] h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand-deep)] shadow-[var(--shadow-db-accent-ring)]" />
      )}
    </div>
  );
}