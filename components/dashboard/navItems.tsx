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

export const NAV_BOTTOM: NavItem[] = [
  { id: "support", label: "Support", icon: React.createElement(HelpCircle, { size: 18 }) },
  { id: "settings", label: "Settings", icon: React.createElement(Settings, { size: 18 }) },
];
