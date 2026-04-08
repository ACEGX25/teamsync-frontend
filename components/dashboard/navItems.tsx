import {
  LayoutDashboard,
  MessageSquare,
  BarChart2,
  Calendar,
  Activity,
  HelpCircle,
  Settings,
} from "lucide-react";
import React from "react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const NAV_MAIN: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: React.createElement(LayoutDashboard, { size: 18 }) },
  { id: "messages", label: "Messages", icon: React.createElement(MessageSquare, { size: 18 }) },
  { id: "organizations", label: "Organizations", icon: React.createElement(BarChart2, { size: 18 }) },
  { id: "schedule", label: "Schedule", icon: React.createElement(Calendar, { size: 18 }) },
  { id: "activity", label: "Activity", icon: React.createElement(Activity, { size: 18 }) },
];

// export const NAV_BOTTOM: NavItem[] = [
//   { id: "support", label: "Support", icon: React.createElement(HelpCircle, { size: 18 }) },
//   { id: "settings", label: "Settings", icon: React.createElement(Settings, { size: 18 }) },
// ];