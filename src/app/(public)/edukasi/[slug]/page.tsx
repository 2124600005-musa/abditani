'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  thumbnail: string | null;
  read_time: string;
  created_at: string;
  related?: { id: number; title: string; slug: string; thumbnail: string | null; category: string }[];
}

export default function EdukasiDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/articles/${slug}`).then(r => {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(d => {
      setArticle(d);
      setLoading(false);
    }).catch(() => {
      setError('Artikel tidak ditemukan');
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="py-20 text-center text-gray-500">Memuat artikel...</div>;
  if (error) return (
    <div className="py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-gray-600 mb-4">{error}</p>
      <Link href="/edukasi" className="btn-primary">Kembali ke Edukasi</Link>
    </div>
  );
  if (!article) return null;

  return (
    <div>
      <section className="py-10">
        <div className="container-custom max-w-4xl">
          <div className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-600">Beranda</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/edukasi" className="hover:text-primary-600">Edukasi</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-gray-900">{article.title}</span>
          </div>

          {article.category && <span className="text-xs text-primary-600 bg-primary-50 px-3 py-1 rounded-full font-medium">{article.category}</span>}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-4">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            {article.author && <span>✍️ {article.author}</span>}
            {article.read_time && <span>⏱️ {article.read_time}</span>}
            {article.created_at && <span>📅 {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
          </div>

          {article.thumbnail && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
            </div>
          )}

          {article.excerpt && (
            <p className="text-lg text-gray-600 italic border-l-4 border-primary-500 pl-4 mb-8">{article.excerpt}</p>
          )}

          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
            {article.content}
          </div>

          {article.related && article.related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Artikel Terkait</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {article.related.map(r => (
                  <Link key={r.id} href={`/edukasi/${r.slug}`} className="card group hover:shadow-md">
                    <div className="aspect-video bg-primary-50 flex items-center justify-center overflow-hidden">
                      {r.thumbnail ? (
                        <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-primary-600">
                          <span className="text-3xl">🌱</span>
                          <span className="text-xs font-bold mt-1">AbdiTani</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {r.category && <span className="text-xs text-primary-600">{r.category}</span>}
                      <h4 className="font-bold text-sm text-gray-900 mt-1 line-clamp-2 group-hover:text-primary-600 transition-colors">{r.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link href="/edukasi" className="btn-secondary">← Kembali ke Edukasi</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
