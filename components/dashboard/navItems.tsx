import {
  LayoutDashboard,
  MessageSquare,
  BarChart2,
  Calendar,
  Activity,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_MAIN: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },

  { id: "organizations", label: "Organizations", icon: BarChart2 },
    { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "activity", label: "Activity", icon: Activity },
];