'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Tag, DollarSign, TrendingUp, FileText, Newspaper, Cpu, MessageSquare, Settings, LogOut, ChevronLeft } from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Package, label: 'Produk', path: '/admin/products' },
  { icon: Tag, label: 'Kategori', path: '/admin/categories' },
  { icon: DollarSign, label: 'Harga Produk', path: '/admin/prices' },
  { icon: TrendingUp, label: 'Komoditas', path: '/admin/commodities' },
  { icon: FileText, label: 'Artikel', path: '/admin/articles' },
  { icon: Newspaper, label: 'Berita', path: '/admin/news' },
  { icon: Cpu, label: 'Teknologi', path: '/admin/technologies' },
  { icon: MessageSquare, label: 'Pesan', path: '/admin/messages' },
  { icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin/login'); };

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className={`fixed inset-y-0 left-0 z-50 bg-gray-900 text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-[68px]' : 'w-64'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
          {!collapsed && <Link href="/admin/dashboard" className="flex items-center gap-2"><img src="/images/abditani-logo.jpg" alt="AbdiTani" className="h-8 w-8 rounded-lg object-cover" /><span className="font-bold">AbdiTani</span></Link>}
          {collapsed && <Link href="/admin/dashboard" className="mx-auto"><img src="/images/abditani-logo.jpg" alt="AbdiTani" className="h-8 w-8 rounded-lg object-cover" /></Link>}
          <button onClick={() => setCollapsed(!collapsed)} className={`text-gray-400 hover:text-white ${collapsed ? 'hidden' : ''}`}><ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} /></button>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const active = pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'} ${collapsed ? 'justify-center' : ''}`} title={collapsed ? item.label : ''}>
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-800 p-2 space-y-1">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white ${collapsed ? 'justify-center' : ''}`}>
            <span className="shrink-0">🌐</span>
            {!collapsed && <span>Lihat Website</span>}
          </Link>
          <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 ${collapsed ? 'justify-center' : ''}`}>
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <main className={`transition-all duration-300 ${collapsed ? 'ml-[68px]' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
}
