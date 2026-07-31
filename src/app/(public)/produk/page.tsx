'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';

export default function Produk() {
  const [products, setProducts] = useState<Array<{id:number;name:string;slug:string;price:number;unit:string;image:string|null;category_name:string|null;location:string|null;status:string|null;category_id:number|null}>>([]);
  const [categories, setCategories] = useState<Array<{id:number;name:string;icon:string|null}>>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryId) params.set('category_id', categoryId);
    if (sort) params.set('sort', sort);
    fetch(`/api/products?${params}`).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [search, categoryId, sort]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Produk Pertanian</h1><p className="text-gray-600 mt-1">Temukan produk pertanian berkualitas dari supplier terpercaya</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Cari produk, supplier, lokasi..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-500">
              <option value="">Terbaru</option>
              <option value="price-low">Harga Terendah</option>
              <option value="price-high">Harga Tertinggi</option>
              <option value="name">Nama A-Z</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <button onClick={() => setCategoryId('')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${!categoryId ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>Semua</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCategoryId(String(c.id))} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${categoryId === String(c.id) ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>{c.icon || '📦'} {c.name}</button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mb-4">{products.length} produk ditemukan</p>
        {loading ? <div className="text-center py-20 text-gray-500">Memuat...</div> : products.length === 0 ? (
          <div className="text-center py-20"><p className="text-gray-500 text-lg">Produk tidak ditemukan</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <Link key={p.id} href={`/produk/${p.slug}`} className="card group">
                <div className="relative overflow-hidden">
                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /> : <div className="w-full h-48 bg-primary-50 flex items-center justify-center text-primary-600"><span className="text-4xl">🌱</span></div>}
                  {p.status && <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">{p.status}</span>}
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary-600 mb-1">{p.category_name || 'Umum'}</p>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">{p.name}</h3>
                  <p className="text-lg font-bold text-primary-600">Rp {Number(p.price).toLocaleString('id-ID')}<span className="text-xs font-normal text-gray-500">/{p.unit}</span></p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500"><MapPin className="w-3 h-3" />{p.location}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
