'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  source: string;
  published_at: string;
}

export default function BeritaPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news').then(r => r.json()).then(d => {
      setNews(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Berita Pertanian</h1>
          <p className="text-primary-100 text-lg">Informasi terbaru seputar dunia pertanian Indonesia.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Memuat berita...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📰</div>
              <p className="text-gray-600">Belum ada berita terbaru.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Featured (first item) */}
              {news[0] && (
                <Link href={`/berita/${news[0].slug}`} className="card group hover:shadow-lg flex flex-col md:flex-row overflow-hidden">
                  <div className="md:w-1/2 aspect-video md:aspect-auto bg-primary-50 flex items-center justify-center overflow-hidden">
                    {news[0].image ? (
                      <img src={news[0].image} alt={news[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-primary-600">
                        <span className="text-5xl">🌱</span>
                        <span className="text-lg font-bold mt-2">AbdiTani</span>
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full self-start mb-3">Berita Utama</span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{news[0].title}</h2>
                    <p className="text-gray-600 mt-3 line-clamp-3">{news[0].excerpt}</p>
                    <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
                      {news[0].source && <span>📰 {news[0].source}</span>}
                      {news[0].published_at && <span>📅 {new Date(news[0].published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.slice(1).map(n => (
                  <Link key={n.id} href={`/berita/${n.slug}`} className="card group hover:shadow-lg hover:-translate-y-1">
                    <div className="aspect-video bg-primary-50 flex items-center justify-center overflow-hidden">
                      {n.image ? (
                        <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-primary-600">
                          <span className="text-4xl">🌱</span>
                          <span className="text-sm font-bold mt-1">AbdiTani</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{n.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{n.excerpt}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        {n.source && <span>📰 {n.source}</span>}
                        {n.published_at && <span>📅 {new Date(n.published_at).toLocaleDateString('id-ID')}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
