'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Tentang', path: '/tentang' },
  { label: 'Produk', path: '/produk' },
  { label: 'Harga', path: '/harga-komoditas' },
  { label: 'Edukasi', path: '/edukasi' },
  { label: 'Berita', path: '/berita' },
  { label: 'Teknologi', path: '/teknologi' },
  { label: 'Kontak', path: '/kontak' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container-custom flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/abditani-logo.jpg"
            alt="Logo AbdiTani - Platform Pertanian Digital"
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="text-xl font-bold text-gray-900">AbdiTani</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              href={l.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                isActive(l.path)
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              aria-current={isActive(l.path) ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/kontak"
            className="btn-primary text-sm !px-4 !py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Hubungi Kami
          </Link>
          <Link
            href="/admin/login"
            className="text-xs text-gray-400 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >
            Admin
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                  isActive(l.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-current={isActive(l.path) ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 flex gap-2">
              <Link
                href="/kontak"
                onClick={() => setOpen(false)}
                className="btn-primary text-sm flex-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Hubungi Kami
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="btn-secondary text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
