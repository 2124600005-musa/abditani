'use client';

export default function TentangPage() {
  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title text-center mb-4">Tentang AbdiTani</h1>
          <p className="section-subtitle text-center mx-auto mb-12">Platform digital pertanian Indonesia untuk petani modern</p>

          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm mb-10">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                AbdiTani hadir dengan visi untuk mentransformasi pertanian Indonesia melalui teknologi digital.
                Kami percaya bahwa setiap petani berhak mendapatkan akses informasi, pasar, dan teknologi
                yang sebelumnya sulit dijangkau.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                {[
                  { icon: '🌾', title: 'Digitalisasi Pertanian', desc: 'Menghubungkan petani dengan pasar digital dan informasi real-time.' },
                  { icon: '📊', title: 'Data Transparan', desc: 'Menyediakan data harga komoditas yang akurat dan terkini.' },
                  { icon: '🎓', title: 'Edukasi Berkelanjutan', desc: 'Memberikan pengetahuan pertanian modern melalui artikel dan panduan.' },
                  { icon: '🤖', title: 'Adopsi Teknologi', desc: 'Memperkenalkan teknologi IoT, AI, dan drone untuk pertanian presisi.' },
                ].map((m, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-3xl">{m.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{m.title}</h3>
                      <p className="text-sm text-gray-600">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kenapa AbdiTani?</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Indonesia memiliki 26 juta hektar lahan pertanian aktif. Namun, sebagian besar petani
                masih menghadapi tantangan dalam mengakses informasi pasar, teknologi, dan edukasi yang tepat.
                AbdiTani berkomendmen untuk menjembatani kesenjangan ini.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { num: '26M+', label: 'Hektar Lahan' },
                  { num: '50+', label: 'Kelompok Tani' },
                  { num: '100+', label: 'Produk Tersedia' },
                  { num: '24/7', label: 'Akses Data' },
                ].map((s, i) => (
                  <div key={i} className="bg-primary-50 rounded-xl p-4">
                    <p className="text-2xl md:text-3xl font-bold text-primary-700">{s.num}</p>
                    <p className="text-sm text-gray-600 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
