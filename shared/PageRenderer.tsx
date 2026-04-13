import OrganizationsPage from "@/components/organizations/OrganizationsPage";

interface PageRendererProps {
  active: string;
  dashboardContent: React.ReactNode;
}

export default function PageRenderer({ active, dashboardContent }: PageRendererProps) {
  switch (active) {
    case "organizations":
      return <OrganizationsPage />;
    default:
      return <>{dashboardContent}</>;
  }
}