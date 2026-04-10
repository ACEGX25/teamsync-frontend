import { Plus } from "lucide-react";

interface Props {
  onNew: () => void;
}

export default function OrgHeader({ onNew }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1
          className="text-[28px] font-bold tracking-[-0.04em] text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Organizations
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--color-text-secondary)]">
          Manage and monitor your organizations
        </p>
      </div>
      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95 active:scale-95"
        style={{
          background: "linear-gradient(135deg, var(--color-brand), var(--color-brand-deep))",
          boxShadow: "var(--shadow-shell-cta)",
        }}
      >
        <Plus size={15} strokeWidth={2.5} />
        New Organization
      </button>
    </div>
  );
}