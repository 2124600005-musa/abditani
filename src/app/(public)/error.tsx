'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h1>
        <p className="text-gray-600 mb-6">
          {error.message || 'Sepertinya ada yang salah. Silakan coba lagi.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Coba Lagi
          </button>
          <Link href="/" className="btn-secondary inline-flex items-center justify-center gap-2">
            <Home size={18} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
