import { Plus } from "lucide-react";

interface Props {
  onNew: () => void;
}

export default function OrgHeader({ onNew }: Props) {
  return (
    <div className="w-full px-8 pt-8 pb-6">
      <div className="flex items-start justify-between gap-6">
        {/* Left — eyebrow + title + subtitle */}
        <div className="flex flex-col gap-2 max-w-lg">
          <p
            className="text-[11px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: "var(--color-brand)" }}
          >
            Workspace Overview
          </p>
          <h1
            className="text-[50px] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Organization Hub
          </h1>
          <p className="text-[14px] leading-[1.6] text-[var(--color-text-secondary)] mt-1">
            Manage your enterprise ecosystem. Coordinate cross-functional
            channels, monitor active memberships, and streamline
            organizational flow.
          </p>
        </div>

        {/* Right — CTA */}
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95 active:scale-95 flex-shrink-0 mt-6"
          style={{
            background: "linear-gradient(135deg, var(--color-brand), var(--color-brand-deep))",
            boxShadow: "var(--shadow-shell-cta)",
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Organization
        </button>
      </div>
    </div>
  );
}