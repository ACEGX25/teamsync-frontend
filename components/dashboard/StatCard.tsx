interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  value: string;
  iconBgClass: string;
}

export default function StatCard({ icon, label, sublabel, value, iconBgClass }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-[var(--color-divider)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-db-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-db-card-hover)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-brand),var(--color-brand-light),var(--color-brand-deep))] opacity-80" />
      <div className="flex items-center gap-3.5">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${iconBgClass} ring-1 ring-[var(--color-white-soft-70)] shadow-[var(--shadow-db-icon)]`}>
          {icon}
        </div>

        <div className="min-w-0">
          <p className="m-0 text-[10.5px] font-bold uppercase leading-[1.35] tracking-[0.8px] text-[var(--color-text-muted)]">
            {label}
            {sublabel && <span className="block">{sublabel}</span>}
          </p>
          <p className="m-0 mt-0.5 font-[var(--font-display)] text-[22px] font-bold tracking-[-0.5px] text-[var(--color-text-primary)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}