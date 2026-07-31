'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  source: string;
  image: string | null;
  published_at: string;
  related?: { id: number; title: string; slug: string; image: string | null; excerpt: string; source: string; published_at: string }[];
}

export default function BeritaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/news/${slug}`).then(r => {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(d => {
      setNews(d);
      setLoading(false);
    }).catch(() => {
      setError('Berita tidak ditemukan');
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="py-20 text-center text-gray-500">Memuat berita...</div>;
  if (error || !news) return (
    <div className="py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-gray-600 mb-4">{error || 'Berita tidak ditemukan'}</p>
      <Link href="/berita" className="btn-primary">Kembali ke Berita</Link>
    </div>
  );

  return (
    <div>
      <section className="py-10">
        <div className="container-custom max-w-4xl">
          <div className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-600">Beranda</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/berita" className="hover:text-primary-600">Berita</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-gray-900">{news.title}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{news.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            {news.source && <span>📰 {news.source}</span>}
            {news.published_at && <span>📅 {new Date(news.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
          </div>

          {news.image && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <img src={news.image} alt={news.title} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
            </div>
          )}

          {news.excerpt && (
            <p className="text-lg text-gray-600 italic border-l-4 border-primary-500 pl-4 mb-8">{news.excerpt}</p>
          )}

          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
            {news.content}
          </div>

          {news.related && news.related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Berita Terkait</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {news.related.map(r => (
                  <Link key={r.id} href={`/berita/${r.slug}`} className="card group hover:shadow-md">
                    <div className="aspect-video bg-primary-50 flex items-center justify-center overflow-hidden">
                      {r.image ? (
                        <img src={r.image} alt={r.title} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-primary-600">
                          <span className="text-3xl">🌱</span>
                          <span className="text-xs font-bold mt-1">AbdiTani</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">{r.title}</h4>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        {r.source && <span>{r.source}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link href="/berita" className="btn-secondary">&larr; Kembali ke Berita</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
