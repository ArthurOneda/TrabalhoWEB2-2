import { Sidebar } from '../components/features/dashboard/Sidebar';
import { Header } from '../components/features/dashboard/Header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}