import MessageItem from "./MessageItem";

const messages = [
  {
    initials: "SJ",
    name: "Sarah Jenkins",
    time: "2m ago",
    preview: "I've uploaded the new brand guidelines to the 'Design' organization. Let me kno...",
    tone: "violet" as const,
    unread: true,
  },
  {
    initials: "MD",
    name: "Marketing Department",
    time: "15m ago",
    preview: "Meeting minutes for the Q4 strategy session are now available in the shared...",
    tone: "green" as const,
  },
  {
    initials: "DC",
    name: "David Chen",
    time: "1h ago",
    preview: "Can we hop on a quick huddle at 2 PM to discuss the API integration challenges?",
    tone: "red" as const,
    unread: true,
  },
];

export default function RecentMessages() {
  return (
    <div className="rounded-[28px] border border-[var(--color-divider)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-db-card)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Recent Messages</p>
          <h3 className="mt-1 text-[16px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">Stay in the loop</h3>
        </div>
        <button className="rounded-full border border-[var(--color-brand-xsubtle)] bg-[var(--color-brand-xsubtle)] px-3 py-1.5 text-[12px] font-semibold text-[var(--color-brand-deep)] transition hover:scale-[1.02] hover:shadow-[var(--shadow-db-pill)]">
          View All
        </button>
      </div>

      {messages.map((msg, i) => (
        <MessageItem
          key={msg.name}
          {...msg}
          isLast={i === messages.length - 1}
        />
      ))}
    </div>
  );
}