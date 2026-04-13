import { Building2, Users } from "lucide-react";

interface Organization {
  memberCount?: number;
}

interface Props {
  orgs: Organization[];
  loading: boolean;
}

export default function OrgStats({ orgs, loading }: Props) {
  const totalMembers = orgs.reduce((sum, o) => sum + (o.memberCount ?? 0), 0);

  const stats = [
    {
      label: "Total Organizations",
      value: loading ? "—" : String(orgs.length),
      icon: Building2,
      bg: "var(--color-db-stats-members-bg)",
      iconColor: "var(--color-db-stats-members-icon)",
    },
   /* {
      label: "Total Members",
      value: loading ? "—" : String(totalMembers),
      icon: Users,
      bg: "var(--color-db-stats-messages-bg)",
      iconColor: "var(--color-db-stats-messages-icon)",
    }, */
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {stats.map(({ label, value, icon: Icon, bg, iconColor }) => (
        <div
          key={label}
          className="rounded-[20px] border border-[var(--color-divider)] p-5 transition hover:shadow-[var(--shadow-db-card-hover)] bg-[var(--color-db-surface-glass)] backdrop-blur-[2px] shadow-[var(--shadow-db-card)]"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: bg }}
            >
              <Icon size={15} style={{ color: iconColor }} />
            </div>
            <span className="text-[12.5px] text-[var(--color-text-secondary)] font-medium">
              {label}
            </span>
          </div>
          <p className="text-[28px] font-bold tracking-[-0.03em] text-[var(--color-text-primary)] font-[family-name:var(--font-display)]">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}