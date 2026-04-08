export const metadata = {
  title: "Dashboard | TeamSync",
  description: "Your TeamSync dashboard",
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {children}
    </div>
  );
}
