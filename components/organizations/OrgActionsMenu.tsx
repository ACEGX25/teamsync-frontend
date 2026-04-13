"use client";

import { useEffect, useRef } from "react";
import { Users, Trash2 } from "lucide-react";

interface Props {
  onViewMembers: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function OrgActionsMenu({ onViewMembers, onDelete, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
     { label: "Delete", icon: Trash2, action: onDelete, danger: true },
    { label: "View Members", icon: Users, action: onViewMembers, danger: false },
];

  return (
    <div
      ref={ref}
      className="absolute right-10 z-30 w-44 rounded-2xl py-1.5 overflow-hidden"
      style={{
        background: "var(--color-surface-frost-90)",
        border: "1px solid var(--color-divider)",
        boxShadow: "var(--shadow-card)",
        backdropFilter: "blur(8px)",
      }}
    >
      {items.map(({ label, icon: Icon, action, danger }) => (
        <button
  key={label}
  onClick={() => { action(); onClose(); }}
  // Added h-9 for consistent height and items-center for vertical alignment
  className="w-full flex items-center gap-3 px-3 h-9 text-[13px] font-medium transition-colors text-left"
  style={{ color: danger ? "var(--color-error)" : "var(--color-text-primary)" }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.background = danger
      ? "var(--color-error-bg)"
      : "var(--color-brand-xsubtle)")
  }
  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
>
  <Icon size={16} className="shrink-0" />
  <span className="truncate">{label}</span>
</button>
      ))}
    </div>
  );
}