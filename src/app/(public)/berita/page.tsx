'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ExternalLink, Search, X, Newspaper } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  source: string;
  published_at: string;
}

export default function Berita() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(d => setNews(Array.isArray(d) ? d : []))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = news.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Berita Pertanian</h1>
          <p className="text-gray-600 mt-1">Informasi terkini seputar pertanian Indonesia</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berita..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Memuat berita...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada berita</p>
            <p className="text-sm text-gray-400 mt-1">{search ? 'Coba kata kunci lain' : 'Berita akan segera tersedia'}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(n => (
              <Link key={n.id} href={`/berita/${n.slug}`} className="card group">
                <div className="overflow-hidden">
                  {n.image ? (
                    <img src={n.image} alt={n.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-48 bg-primary-50 flex items-center justify-center text-primary-600">
                      <Newspaper className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{n.published_at ? new Date(n.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                    <span>•</span>
                    <span>{n.source}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{n.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{n.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary-600">
                    Baca Selengkapnya <ExternalLink className="w-3.5 h-3.5" />
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
