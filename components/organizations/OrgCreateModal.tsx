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
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--color-overlay-dark)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md rounded-[28px] p-7"
        style={{
          background: "var(--color-surface-frost-90)",
          border: "1px solid var(--color-divider)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-[18px] font-bold tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            New Organization
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition"
            style={{ color: "var(--color-text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-brand-subtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={16} />
          </button>
        </div>

        {/* Input */}
        <label
          className="block text-[12.5px] font-medium mb-1.5"
          style={{ color: "var(--color-text-secondary)" }}
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
          className="w-full rounded-xl px-4 py-2.5 text-[13.5px] outline-none transition mb-1.5"
          style={{
            border: "1px solid var(--color-input-border)",
            background: "var(--color-input-bg)",
            color: "var(--color-text-primary)",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-focus)")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />

        {error && (
          <p className="text-[12px] mt-1 mb-2" style={{ color: "var(--color-error)" }}>
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-[13.5px] font-medium transition"
            style={{
              border: "1px solid var(--color-divider)",
              color: "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-brand-xsubtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={creating}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13.5px] font-semibold text-white transition disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, var(--color-brand), var(--color-brand-deep))",
              boxShadow: creating ? "none" : "var(--shadow-btn)",
            }}
          >
            {creating && <Loader2 size={14} className="animate-spin" />}
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}