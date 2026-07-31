import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary-500 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-8">
          Sepertinya halaman yang kamu cari sudah dipindahkan atau tidak tersedia.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <Home size={18} /> Kembali ke Beranda
          </Link>
          <Link href="/produk" className="btn-secondary inline-flex items-center justify-center gap-2">
            <Search size={18} /> Jelajahi Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
