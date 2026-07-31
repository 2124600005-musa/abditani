'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Clock, User } from 'lucide-react';

const cats = ['Semua', 'Budidaya', 'Hama & Penyakit', 'Hidroponik', 'Teknologi', 'Pasca Panen', 'Bisnis Pertanian'];

export default function Edukasi() {
  const [articles, setArticles] = useState<Array<{id:number;title:string;slug:string;category:string;excerpt:string;thumbnail:string|null;author:string;read_time:string}>>([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (cat !== 'Semua') params.set('category', cat);
    fetch(`/api/articles?${params}`).then(r => r.json()).then(d => setArticles(Array.isArray(d) ? d : [])).catch(() => setArticles([])).finally(() => setLoading(false));
  }, [search, cat]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Edukasi Pertanian</h1><p className="text-gray-600 mt-1">Pelajari teknik pertanian modern dari para ahli</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Cari artikel..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div></div>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${cat === c ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>{c}</button>)}</div>
        {loading ? <div className="text-center py-20 text-gray-500">Memuat...</div> : articles.length === 0 ? <div className="text-center py-20"><p className="text-gray-500">Tidak ada artikel ditemukan</p></div> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{articles.map(a => (
            <Link key={a.id} href={`/edukasi/${a.slug}`} className="card group">
              <div className="overflow-hidden">{a.thumbnail ? <img src={a.thumbnail} alt={a.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /> : <div className="w-full h-48 bg-primary-50 flex items-center justify-center text-primary-600"><span className="text-4xl">📚</span></div>}</div>
              <div className="p-5">
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{a.category}</span>
                <h3 className="font-semibold text-gray-900 mt-3 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{a.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{a.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500"><span className="flex items-center gap-1"><User className="w-3 h-3" />{a.author}</span><span>•</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.read_time}</span></div>
              </div>
            </Link>
          ))}</div>
        )}
      </div>
    </div>
  );
}
