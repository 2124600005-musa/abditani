'use client';
import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, MapPin, Search, X } from 'lucide-react';

interface Commodity {
  id: number;
  name: string;
  icon: string;
  price: number;
  previous_price: number;
  change_pct: number;
  unit: string;
  region: string;
}

export default function HargaKomoditas() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');

  useEffect(() => {
    fetch('/api/commodities')
      .then(r => r.json())
      .then(d => setCommodities(Array.isArray(d) ? d : []))
      .catch(() => setCommodities([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let items = commodities.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'price') items.sort((a, b) => b.price - a.price);
    else if (sortBy === 'change') items.sort((a, b) => b.change_pct - a.change_pct);
    else items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [commodities, search, sortBy]);

  const naik = commodities.filter(c => c.change_pct > 0).length;
  const turun = commodities.filter(c => c.change_pct < 0).length;
  const stabil = commodities.filter(c => c.change_pct === 0).length;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Harga Komoditas</h1>
          <p className="text-gray-600 mt-1">Pantau harga pasar komoditas pertanian terkini</p>
          <p className="text-xs text-gray-400 mt-2">
            Update terakhir: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{naik}</p>
            <p className="text-sm text-gray-500">Naik</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-red-600">{turun}</p>
            <p className="text-sm text-gray-500">Turun</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-600">{stabil}</p>
            <p className="text-sm text-gray-500">Stabil</p>
          </div>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari komoditas atau wilayah..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Urut: Nama</option>
            <option value="price">Urut: Harga Tertinggi</option>
            <option value="change">Urut: Perubahan Terbesar</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Memuat data harga...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada komoditas ditemukan</p>
            <p className="text-sm text-gray-400 mt-1">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Komoditas</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Harga</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Perubahan</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Satuan</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Wilayah</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{c.icon}</span>
                          <span className="font-medium text-gray-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-primary-600">Rp {Number(c.price).toLocaleString('id-ID')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${c.change_pct >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                          {c.change_pct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {c.change_pct >= 0 ? '+' : ''}{c.change_pct}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">per {c.unit}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {c.region}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
