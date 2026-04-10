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
    <div className="flex h-screen w-full bg-gray-50">
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
