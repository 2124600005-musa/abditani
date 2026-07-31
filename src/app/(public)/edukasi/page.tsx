'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  thumbnail: string | null;
  author: string;
  read_time: string;
  created_at: string;
}

export default function EdukasiPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const catList = ['Tanaman', 'Peternakan', 'Pertanian Organik', 'Teknologi Pertanian', 'Manajemen Usaha'];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    fetch('/api/articles?' + params.toString()).then(r => r.json()).then(d => {
      setArticles(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, category]);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Edukasi Pertanian</h1>
          <p className="text-primary-100 text-lg">Belajar pertanian dari artikel dan panduan ahli.</p>
        </div>
      </section>
      <section className="py-10">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 mb-8">
            <input type="text" placeholder="Cari artikel..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm" />
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-primary-500 outline-none">
              <option value="">Semua Kategori</option>
              {catList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {loading ? (
            <div className="text-center py-20 text-gray-500">Memuat artikel...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-gray-600">Tidak ada artikel ditemukan.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">Menampilkan {articles.length} artikel</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(a => (
                  <Link key={a.id} href={'/edukasi/' + a.slug} className="card group hover:shadow-lg hover:-translate-y-1">
                    <div className="aspect-video bg-primary-50 flex items-center justify-center overflow-hidden">
                      {a.thumbnail ? (
                        <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-primary-600">
                          <span className="text-4xl">🌱</span>
                          <span className="text-sm font-bold mt-1">AbdiTani</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {a.category && <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{a.category}</span>}
                      <h3 className="font-bold text-gray-900 mt-2 group-hover:text-primary-600 transition-colors line-clamp-2">{a.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{a.excerpt}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        {a.author && <span>✍️ {a.author}</span>}
                        {a.read_time && <span>⏱️ {a.read_time}</span>}
                        {a.created_at && <span>📅 {new Date(a.created_at).toLocaleDateString('id-ID')}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
