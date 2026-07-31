'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';

export default function HargaKomoditas() {
  const [commodities, setCommodities] = useState<Array<{id:number;name:string;icon:string;price:number;change_pct:number;unit:string;region:string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/commodities').then(r => r.json()).then(d => setCommodities(Array.isArray(d) ? d : [])).catch(() => setCommodities([])).finally(() => setLoading(false)); }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Harga Komoditas</h1>
          <p className="text-gray-600 mt-1">Pantau harga pasar komoditas pertanian terkini</p>
          <p className="text-xs text-gray-400 mt-2">Update terakhir: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center"><p className="text-2xl font-bold text-green-600">{commodities.filter(c => c.change_pct > 0).length}</p><p className="text-sm text-gray-500">Naik</p></div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center"><p className="text-2xl font-bold text-red-600">{commodities.filter(c => c.change_pct < 0).length}</p><p className="text-sm text-gray-500">Turun</p></div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center"><p className="text-2xl font-bold text-gray-600">{commodities.filter(c => c.change_pct === 0).length}</p><p className="text-sm text-gray-500">Stabil</p></div>
        </div>
        {loading ? <div className="text-center py-20 text-gray-500">Memuat...</div> : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Komoditas</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Harga</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Perubahan</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Satuan</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Wilayah</th>
                </tr></thead>
                <tbody>{commodities.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="text-2xl">{c.icon}</span><span className="font-medium text-gray-900">{c.name}</span></div></td>
                    <td className="px-6 py-4"><span className="text-lg font-bold text-primary-600">Rp {Number(c.price).toLocaleString('id-ID')}</span></td>
                    <td className="px-6 py-4"><div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${c.change_pct >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>{c.change_pct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}{c.change_pct >= 0 ? '+' : ''}{c.change_pct}%</div></td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">per {c.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell"><div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{c.region}</div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
