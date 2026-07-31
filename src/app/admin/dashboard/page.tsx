'use client';
import { useState, useEffect } from 'react';
import { Package, Tag, TrendingUp, FileText, Newspaper, MessageSquare } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{className?: string}>> = { products: Package, categories: Tag, commodities: TrendingUp, articles: FileText, news: Newspaper, messages: MessageSquare };

export default function AdminDashboard() {
  const [data, setData] = useState<{stats:Record<string,number>;recentProducts:Array<{id:number;name:string;price:number;status:string}>;recentArticles:Array<{id:number;title:string;category:string;status:string}>;recentMessages:Array<{id:number;name:string;subject:string;status:string}>}|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/admin/dashboard', { credentials: 'include' }).then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="p-6"><div className="text-center py-20 text-gray-500">Memuat dashboard...</div></div>;
  if (!data) return <div className="p-6"><div className="text-center py-20 text-gray-500">Gagal memuat data</div></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.stats).map(([key, val]) => {
          const Icon = iconMap[key] || Package;
          return (
            <div key={key} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center"><Icon className="w-5 h-5 text-primary-600" /></div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{val}</p>
              <p className="text-sm text-gray-500 capitalize">{key}</p>
            </div>
          );
        })}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Produk Terbaru</h3>
          <div className="space-y-3">{data.recentProducts?.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{p.name}</p><p className="text-xs text-gray-500">Rp {Number(p.price).toLocaleString('id-ID')}</p></div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'tersedia' ? 'text-green-700 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>{p.status}</span>
            </div>
          ))}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Artikel Terbaru</h3>
          <div className="space-y-3">{data.recentArticles?.map(a => (
            <div key={a.id} className="p-3 rounded-lg bg-gray-50">
              <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
              <p className="text-xs text-gray-500">{a.category} • {a.status}</p>
            </div>
          ))}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Pesan Terbaru</h3>
          <div className="space-y-3">{data.recentMessages?.map(m => (
            <div key={m.id} className="p-3 rounded-lg bg-gray-50">
              <p className="text-sm font-medium text-gray-900">{m.name}</p>
              <p className="text-xs text-gray-500">{m.subject} • {m.status}</p>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}
