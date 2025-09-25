'use client';
import { useLogin } from '@/lib/firebase/hooks';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/main/dashboard', icon: '📊' },
  { name: 'Perfil', href: '/main/profile', icon: '👤' },
];

export function Sidebar() {
  const pathname = usePathname();

  const { logout } = useLogin();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="w-64 bg-white shadow-xl flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">FinTrack</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
      <button
        onClick={handleLogout}
        className="w-full text-left text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
      >
        <span>🚪</span> Sair
      </button>
    </div>
    </div>
  );
}