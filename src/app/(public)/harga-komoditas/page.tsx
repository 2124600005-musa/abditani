'use client';
import { useEffect, useState } from 'react';

interface Commodity {
  id: number;
  name: string;
  slug: string;
  icon: string;
  price: number;
  previous_price: number;
  unit: string;
  region: string;
  change_pct: number;
}

export default function HargaKomoditasPage() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/commodities')
      .then(r => r.json())
      .then(d => { setCommodities(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatPrice = (p: number) => `Rp ${p.toLocaleString('id-ID')}`;

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="section-title">Harga Komoditas</h1>
          <p className="section-subtitle">Informasi harga terkini komoditas pertanian Indonesia</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Memuat data harga...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {commodities.slice(0, 4).map(c => (
                <div key={c.id} className="card p-5 hover:shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{c.icon}</span>
                    <span className="font-medium text-gray-900">{c.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-primary-600">{formatPrice(c.price)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm font-medium ${c.change_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {c.change_pct >= 0 ? '▲' : '▼'} {Math.abs(c.change_pct).toFixed(2)}%
                    </span>
                    <span className="text-xs text-gray-400">vs {formatPrice(c.previous_price)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Daftar Harga Lengkap</h2>
                <p className="text-xs text-gray-500 mt-1">Data harga pasar nasional (per {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Komoditas</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Harga Sekarang</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Sebelumnya</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Perubahan</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Satuan</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Wilayah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {commodities.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{c.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900">{c.name}</p>
                              <p className="text-xs text-gray-500">{c.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-primary-600">{formatPrice(c.price)}</td>
                        <td className="px-6 py-4 text-gray-500">{formatPrice(c.previous_price)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.change_pct >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {c.change_pct >= 0 ? '▲' : '▼'} {Math.abs(c.change_pct).toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{c.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{c.region}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">⚠️ Harga bersifat indikatif dan dapat berubah sewaktu-waktu. Harga aktual dapat berbeda di setiap wilayah.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
