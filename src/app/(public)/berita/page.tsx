'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ExternalLink } from 'lucide-react';

export default function Berita() {
  const [news, setNews] = useState<Array<{id:number;title:string;slug:string;excerpt:string;image:string|null;source:string;published_at:string}>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/news').then(r => r.json()).then(d => setNews(Array.isArray(d) ? d : [])).catch(() => setNews([])).finally(() => setLoading(false)); }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Berita Pertanian</h1><p className="text-gray-600 mt-1">Informasi terkini seputar pertanian Indonesia</p></div>
        {loading ? <div className="text-center py-20 text-gray-500">Memuat...</div> : news.length === 0 ? <div className="text-center py-20"><p className="text-gray-500">Belum ada berita</p></div> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{news.map(n => (
            <Link key={n.id} href={`/berita/${n.slug}`} className="card group">
              <div className="overflow-hidden">{n.image ? <img src={n.image} alt={n.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /> : <div className="w-full h-48 bg-primary-50 flex items-center justify-center text-primary-600"><span className="text-4xl">📰</span></div>}</div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3"><Calendar className="w-3 h-3" /><span>{n.published_at ? new Date(n.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span><span>•</span><span>{n.source}</span></div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{n.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{n.excerpt}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary-600">Baca Selengkapnya <ExternalLink className="w-3.5 h-3.5" /></div>
              </div>
            </Link>
          ))}</div>
        )}
      </div>
    </div>
  );
}
