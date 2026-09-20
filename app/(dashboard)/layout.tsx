import MainSidebar from "@/components/layout/MainSidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />

      <main className="flex-1">
        <Header />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}