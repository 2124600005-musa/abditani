'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const items = [
  { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
  { icon: '📦', label: 'Produk', path: '/admin/products' },
  { icon: '🏷️', label: 'Kategori', path: '/admin/categories' },
  { icon: '💰', label: 'Harga', path: '/admin/prices' },
  { icon: '📈', label: 'Komoditas', path: '/admin/commodities' },
  { icon: '📝', label: 'Artikel', path: '/admin/articles' },
  { icon: '📰', label: 'Berita', path: '/admin/news' },
  { icon: '🤖', label: 'Teknologi', path: '/admin/technologies' },
  { icon: '💬', label: 'Pesan', path: '/admin/messages' },
  { icon: '⚙️', label: 'Pengaturan', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return <>{children}</>;

  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin/login'); };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col">
        <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-800">
          <img src="/images/abditani-logo.jpg" alt="AbdiTani" className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-bold">AbdiTani</span>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const active = pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-800 p-2 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
            <span>🌐</span><span>Lihat Website</span>
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300">
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>
      <div className="ml-64">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-6">
          <div className="ml-auto flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center"><span className="text-sm font-bold text-white">A</span></div>
            <span className="text-sm font-semibold">Admin</span>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
