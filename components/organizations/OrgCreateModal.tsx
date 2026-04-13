import { X, Loader2 } from "lucide-react";

interface Props {
  show: boolean;
  orgName: string;
  creating: boolean;
  error: string;
  onChange: (v: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

export default function OrgCreateModal({
  show, orgName, creating, error, onChange, onCreate, onClose,
}: Props) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay-dark)] backdrop-blur-sm"
    >
      <div
        className="w-full max-w-md rounded-[28px] p-7 bg-[var(--color-surface-frost-90)] border border-[var(--color-divider)] shadow-[var(--shadow-card)]"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold tracking-[-0.03em] font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
            New Organization
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-subtle)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Input */}
        <label
          className="block text-[12.5px] font-medium mb-1.5 text-[var(--color-text-secondary)]"
        >
          Organization Name
        </label>
        <input
          type="text"
          placeholder="e.g. Acme Corp"
          value={orgName}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCreate()}
          autoFocus
          className="w-full rounded-xl px-4 py-2.5 text-[13.5px] outline-none transition mb-1.5 border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)] focus:shadow-[var(--shadow-focus)]"
        />

        {error && (
          <p className="text-[12px] mt-1 mb-2 text-[var(--color-error)]">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-[13.5px] font-medium transition border border-[var(--color-divider)] text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-xsubtle)]"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={creating}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13.5px] font-semibold text-white transition disabled:opacity-60 bg-[image:linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] ${
              creating ? "shadow-none" : "shadow-[var(--shadow-btn)]"
            }`}
          >
            {creating && <Loader2 size={14} className="animate-spin" />}
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}