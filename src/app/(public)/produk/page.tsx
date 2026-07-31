'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageComponent from '@/components/ImageComponent';

interface Product {
  id: number;
  name: string;
  slug: string;
  category_name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  status: string;
  image: string;
  location: string;
  supplier: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  product_count: number;
}

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryId) params.set('category_id', categoryId);
    if (sort) params.set('sort', sort);
    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(d => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [categoryId, sort]);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search]);

  useEffect(() => { fetch('/api/categories').then(r => r.json()).then(setCategories); }, []);

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="section-title">Produk Pertanian</h1>
          <p className="section-subtitle">Temukan produk pertanian berkualitas dari supplier terpercaya</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
              <option value="">Semua Kategori</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
              <option value="">Terbaru</option>
              <option value="price-low">Harga Terendah</option>
              <option value="price-high">Harga Tertinggi</option>
              <option value="name">Nama A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Memuat produk...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Tidak ada produk ditemukan</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <Link key={p.id} href={`/produk/${p.slug}`} className="card group hover:shadow-md">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <ImageComponent src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {p.status === 'habis' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-bold bg-red-500 px-3 py-1 rounded-full text-sm">Stok Habis</span></div>}
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{p.category_name}</span>
                  <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2">{p.name}</h3>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-primary-600">Rp {p.price.toLocaleString('id-ID')}</span>
                    <span className="text-sm text-gray-500"> / {p.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <span>📍</span><span>{p.location || 'Indonesia'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
