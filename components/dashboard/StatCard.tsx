interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  value: string;
  color: string;
}

export default function StatCard({
  icon,
  label,
  sublabel,
  value,
  color,
}: StatCardProps) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-icon" style={{ background: color }}>
        {icon}
      </div>
      <div className="db-stat-text">
        <p className="db-stat-label">
          {label}
          <br />
          <span>{sublabel}</span>
        </p>
        <p className="db-stat-value">{value}</p>
      </div>
    </div>
  );
}