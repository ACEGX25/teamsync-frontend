import {
  IconDashboard,
  IconMessages,
  IconOrganizations,
  IconSchedule,
  IconActivity,
  IconSupport,
  IconSettings,
} from "./Icons";
import { NavItem } from "@/types/types";

export const NAV_MAIN: NavItem[] = [
  { id: "dashboard",     label: "Dashboard",     icon: <IconDashboard /> },
  { id: "messages",      label: "Messages",      icon: <IconMessages /> },
  { id: "organizations", label: "Organizations", icon: <IconOrganizations /> },
  { id: "schedule",      label: "Schedule",      icon: <IconSchedule /> },
  { id: "activity",      label: "Activity",      icon: <IconActivity /> },
];

export const NAV_BOTTOM: NavItem[] = [
  { id: "support",  label: "Support",  icon: <IconSupport /> },
  { id: "settings", label: "Settings", icon: <IconSettings /> },
];