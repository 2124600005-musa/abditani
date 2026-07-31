import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/images/abditani-logo.jpg" alt="AbdiTani" className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-xl font-bold text-white">AbdiTani</span>
            </Link>
            <p className="text-sm leading-relaxed">Teknologi untuk Petani, Masa Depan untuk Negeri.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Informasi</h4>
            <div className="space-y-2 text-sm">
              <Link href="/produk" className="block hover:text-white">Produk</Link>
              <Link href="/harga-komoditas" className="block hover:text-white">Harga Komoditas</Link>
              <Link href="/edukasi" className="block hover:text-white">Edukasi</Link>
              <Link href="/berita" className="block hover:text-white">Berita</Link>
              <Link href="/teknologi" className="block hover:text-white">Teknologi</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
            <div className="space-y-2 text-sm">
              <Link href="/tentang" className="block hover:text-white">Tentang Kami</Link>
              <Link href="/kontak" className="block hover:text-white">Kontak</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Hubungi Kami</h4>
            <div className="space-y-2 text-sm">
              <p>Jl. Pertanian No. 123, Jakarta Selatan</p>
              <p>info@abditani.id</p>
              <p>+62 21 1234 5678</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © 2026 AbdiTani. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
