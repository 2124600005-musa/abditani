'use client';
import { Target, Eye, Leaf, Award, Users } from 'lucide-react';

export default function Tentang() {
  return (
    <div className="pt-24 pb-16">
      <section className="py-16 bg-gradient-to-br from-primary-800 to-primary-950 text-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang AbdiTani</h1>
          <p className="text-lg text-primary-100/80 max-w-2xl mx-auto">AbdiTani hadir sebagai platform digital yang membantu masyarakat mendapatkan informasi, produk, edukasi, dan teknologi pertanian secara lebih mudah.</p>
        </div>
      </section>
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cerita Kami</h2>
              <p className="text-gray-600 leading-relaxed mb-4">AbdiTani lahir dari kepedulian terhadap nasib petani Indonesia. Kami melihat bahwa petani membutuhkan akses yang lebih baik terhadap informasi, teknologi, dan pasar untuk meningkatkan kesejahteraan mereka.</p>
              <p className="text-gray-600 leading-relaxed">Dengan memanfaatkan teknologi digital, kami membangun platform yang menghubungkan seluruh pemangku kepentingan dalam ekosistem pertanian.</p>
            </div>
            <div className="bg-primary-50 rounded-3xl p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center text-primary-600">
                <Leaf className="w-16 h-16 mx-auto mb-4" />
                <span className="text-2xl font-bold">AbdiTani</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4"><Eye className="w-6 h-6 text-primary-600" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visi Kami</h3>
              <p className="text-gray-600 leading-relaxed">Menjadi platform informasi pertanian terpercaya yang mendukung kemajuan petani Indonesia.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4"><Target className="w-6 h-6 text-primary-600" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Misi Kami</h3>
              <ul className="text-gray-600 space-y-2">
                <li>✅ Mempermudah akses informasi pertanian</li>
                <li>✅ Mendukung digitalisasi pertanian</li>
                <li>✅ Memperkenalkan produk pertanian</li>
                <li>✅ Mendorong pemanfaatan teknologi</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Nilai-Nilai Kami</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: 'Berkelanjutan', desc: 'Mendukung praktik pertanian ramah lingkungan.' },
              { icon: Award, title: 'Terpercaya', desc: 'Informasi dan produk terverifikasi kualitasnya.' },
              { icon: Users, title: 'Kolaboratif', desc: 'Membangun ekosistem yang menguntungkan semua pihak.' },
              { icon: Target, title: 'Inovatif', desc: 'Menghadirkan solusi teknologi untuk pertanian.' },
            ].map((v, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><v.icon className="w-7 h-7 text-primary-600" /></div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
