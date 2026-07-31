'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => { fetch('/api/admin/dashboard', { credentials: 'include' }).then(r => r.json()).then(setData).catch(() => {}); }, []);

  if (!data) return <div className="text-center py-20 text-gray-500">Memuat...</div>;
  const stats = data.stats as Record<string, number>;
  const icons: Record<string, string> = { products: '📦', categories: '🏷️', commodities: '📈', articles: '📝', news: '📰', messages: '💬' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3"><span className="text-2xl">{icons[key] || '📊'}</span></div>
            <p className="text-2xl font-bold">{val}</p>
            <p className="text-sm text-gray-500 capitalize">{key}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold mb-4">Produk Terbaru</h3>
          <div className="space-y-2">{(data.recentProducts as Array<{id:number;name:string;price:number;status:string}>)?.map(p => (
            <div key={p.id} className="flex justify-between p-2 rounded bg-gray-50 text-sm"><span>{p.name}</span><span className="font-medium">Rp {p.price?.toLocaleString('id-ID')}</span></div>
          ))}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold mb-4">Artikel Terbaru</h3>
          <div className="space-y-2">{(data.recentArticles as Array<{id:number;title:string;category:string}>)?.map(a => (
            <div key={a.id} className="p-2 rounded bg-gray-50 text-sm"><span>{a.title}</span></div>
          ))}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold mb-4">Pesan Terbaru</h3>
          <div className="space-y-2">{(data.recentMessages as Array<{id:number;name:string;subject:string}>)?.map(m => (
            <div key={m.id} className="p-2 rounded bg-gray-50 text-sm"><span>{m.name}</span> — <span className="text-gray-500">{m.subject}</span></div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}
