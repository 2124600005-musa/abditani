'use client';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h1>
        <p className="text-gray-600 mb-6">
          {error.message || 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Coba Lagi
          </button>
          <a href="/admin/dashboard" className="btn-secondary">
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
