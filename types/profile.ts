export interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
  professionalHeadline: string;
  bio: string;
  timezone: string;
  primaryLanguage: string;
  availabilityStatus: boolean;
  showWorkPortfolio: boolean;
  role: string;
  location: string;
  notificationChannels: {
    emailAlerts: boolean;
    pushNotifications: boolean;
    usageReports: boolean;
  };
}