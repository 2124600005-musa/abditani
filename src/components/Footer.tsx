import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/images/abditani-logo.jpg"
                alt="Logo AbdiTani"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-white">AbdiTani</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Teknologi untuk Petani, Masa Depan untuk Negeri.
            </p>
          </div>

          <nav aria-label="Informasi">
            <h4 className="font-semibold text-white mb-4">Informasi</h4>
            <div className="space-y-2 text-sm">
              <Link href="/produk" className="block hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded">
                Produk
              </Link>
              <Link href="/harga-komoditas" className="block hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded">
                Harga Komoditas
              </Link>
              <Link href="/edukasi" className="block hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded">
                Edukasi
              </Link>
              <Link href="/berita" className="block hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded">
                Berita
              </Link>
              <Link href="/teknologi" className="block hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded">
                Teknologi
              </Link>
            </div>
          </nav>

          <nav aria-label="Perusahaan">
            <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
            <div className="space-y-2 text-sm">
              <Link href="/tentang" className="block hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded">
                Tentang Kami
              </Link>
              <Link href="/kontak" className="block hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded">
                Kontak
              </Link>
            </div>
          </nav>

          <div>
            <h4 className="font-semibold text-white mb-4">Hubungi Kami</h4>
            <div className="space-y-2 text-sm">
              <p>Toko Abdi Tani, Jl. Lintas Sumatera Simp 500 II, RT.2/RW.1, Rambah Hilir, Rokan Hulu, Riau</p>
              <p>
                <a
                  href="mailto:info@abditani.id"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
                  aria-label="Kirim email ke info@abditani.id"
                >
                  info@abditani.id
                </a>
              </p>
              <p>
                <a
                  href="https://wa.me/6281364083093"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
                  aria-label="WhatsApp +62 813-6408-3093"
                >
                  +62 813-6408-3093
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {currentYear} AbdiTani. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
