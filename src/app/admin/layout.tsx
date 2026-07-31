'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Tag, DollarSign, TrendingUp, FileText, Newspaper, Cpu, MessageSquare, Image, Settings, LogOut, ChevronLeft, Menu } from 'lucide-react';

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
  { icon: Image, label: 'Media', path: '/admin/media' },
  { icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin/login'); };

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-gray-900 text-white p-2 rounded-lg"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-gray-900 text-white transition-all duration-300 flex flex-col
        ${collapsed ? 'w-[68px]' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <img src="/images/abditani-logo.jpg" alt="AbdiTani Admin" className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-bold">AbdiTani</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin/dashboard" className="mx-auto" aria-label="Dashboard">
              <img src="/images/abditani-logo.jpg" alt="AbdiTani" className="h-8 w-8 rounded-lg object-cover" />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`text-gray-400 hover:text-white hidden lg:block ${collapsed ? 'hidden' : ''}`}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {items.map((item) => {
            const active = pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-800 p-2 space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white ${collapsed ? 'justify-center' : ''}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="shrink-0" aria-hidden="true">🌐</span>
            {!collapsed && <span>Lihat Website</span>}
          </Link>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 ${collapsed ? 'justify-center' : ''}`}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`transition-all duration-300 min-h-screen ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-64'}`}>
        {children}
      </main>
    </div>
  );
}
