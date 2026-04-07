interface ActivityItemProps {
  icon: React.ReactNode;
  text: string;
  highlight: string;
  time: string;
  color: string;
}

export default function ActivityItem({
  icon,
  text,
  highlight,
  time,
  color,
}: ActivityItemProps) {
  return (
    <div className="db-act-item">
      <div className="db-act-icon" style={{ background: color }}>
        {icon}
      </div>
      <div className="db-act-body">
        <p className="db-act-text">
          {text} <span className="db-act-highlight">{highlight}</span>
        </p>
        <p className="db-act-time">{time}</p>
      </div>
    </div>
  );
}