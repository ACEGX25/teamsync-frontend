import { Video, Building2 } from "lucide-react";

interface QuickActionsProps {
  onStartMeeting?: () => void;
}

export default function QuickActions({ onStartMeeting }: QuickActionsProps) {
  return (
    <div className="rounded-[28px] border border-[var(--color-divider)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-db-card)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Quick Actions</p>
          <h3 className="mt-1 text-[16px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">Launch work faster</h3>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)] grid place-items-center shadow-[var(--shadow-db-inset-soft)]">
          <Video size={18} />
        </div>
      </div>

      <button
        onClick={onStartMeeting}
        className="group mb-3 flex w-full items-center gap-3 rounded-2xl border border-[var(--color-brand-xsubtle)] bg-[var(--color-brand-xsubtle)] px-4 py-4 text-left text-[14px] font-semibold text-[var(--color-db-qa-primary-text)] shadow-[var(--shadow-db-btn-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-db-btn-soft-hover)]"
      >
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--color-db-quick-icon-primary-bg)] text-[var(--color-db-qa-primary-text)] transition group-hover:scale-105">
          <Video size={17} strokeWidth={2.1} />
        </div>
        <span className="flex-1">Start a Meeting</span>
        <span className="text-[12px] opacity-70 transition group-hover:translate-x-0.5">→</span>
      </button>

      <button
        className="group mb-4 flex w-full items-center gap-3 rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-db-qa-secondary-soft)] px-4 py-4 text-left text-[14px] font-semibold text-[var(--color-db-qa-secondary-text)] transition hover:-translate-y-0.5 hover:border-[var(--color-brand-light)] hover:shadow-[var(--shadow-db-card)]"
      >
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--color-db-quick-icon-secondary-bg)] text-[var(--color-brand-deep)] transition group-hover:scale-105">
          <Building2 size={17} />
        </div>
        <span className="flex-1">Create Organization</span>
        <span className="text-[12px] opacity-70 transition group-hover:translate-x-0.5">→</span>
      </button>

      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-db-upcoming-label)]">
          Upcoming Next
        </p>
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-divider)] bg-[var(--color-db-upcoming-bg)] px-4 py-3.5 shadow-[var(--shadow-db-upcoming)]">
          <div className="h-9 w-1 rounded-full bg-gradient-to-b from-[var(--color-brand)] to-[var(--color-brand-deep)] shadow-[var(--shadow-db-upcoming-ring)]" />
          <div>
            <div className="text-[13.5px] font-semibold tracking-[-0.01em] text-[var(--color-text-primary)]">
              Product Sync
            </div>
            <div className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">
              10:30 AM – 11:15 AM
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}