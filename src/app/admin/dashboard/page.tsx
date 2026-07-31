'use client';
import { useState, useEffect } from 'react';
import { Package, Tag, TrendingUp, FileText, Newspaper, MessageSquare, BarChart3, Users, Clock } from 'lucide-react';

interface DashboardData {
  stats: Record<string, number>;
  recentProducts: Array<{ id: number; name: string; price: number; status: string; created_at: string }>;
  recentArticles: Array<{ id: number; title: string; category: string; status: string; created_at: string }>;
  recentMessages: Array<{ id: number; name: string; subject: string; status: string; created_at: string }>;
}

const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  products: Package,
  categories: Tag,
  commodities: TrendingUp,
  articles: FileText,
  news: Newspaper,
  messages: MessageSquare,
};

const colorMap: Record<string, string> = {
  products: 'bg-blue-50 text-blue-600',
  categories: 'bg-purple-50 text-purple-600',
  commodities: 'bg-amber-50 text-amber-600',
  articles: 'bg-green-50 text-green-600',
  news: 'bg-cyan-50 text-cyan-600',
  messages: 'bg-rose-50 text-rose-600',
};

const labelMap: Record<string, string> = {
  products: 'Produk',
  categories: 'Kategori',
  commodities: 'Komoditas',
  articles: 'Artikel',
  news: 'Berita',
  messages: 'Pesan',
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard', { credentials: 'include' })
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-6">
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    </div>
  );

  if (!data) return (
    <div className="p-6">
      <div className="text-center py-20">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Gagal memuat data dashboard</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.stats).map(([key, val]) => {
          const Icon = iconMap[key] || Package;
          const colors = colorMap[key] || 'bg-gray-50 text-gray-600';
          return (
            <div key={key} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{val}</p>
              <p className="text-sm text-gray-500">{labelMap[key] || key}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Items */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Produk Terbaru</h3>
            <a href="/admin/products" className="text-xs text-primary-600 hover:text-primary-700">Lihat Semua</a>
          </div>
          {data.recentProducts?.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Belum ada produk</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentProducts?.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${p.status === 'tersedia' ? 'text-green-700 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Articles */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Artikel Terbaru</h3>
            <a href="/admin/articles" className="text-xs text-primary-600 hover:text-primary-700">Lihat Semua</a>
          </div>
          {data.recentArticles?.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Belum ada artikel</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentArticles?.map(a => (
                <div key={a.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{a.category}</span>
                    <span className={`text-xs ${a.status === 'published' ? 'text-green-600' : 'text-gray-500'}`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Pesan Terbaru</h3>
            <a href="/admin/messages" className="text-xs text-primary-600 hover:text-primary-700">Lihat Semua</a>
          </div>
          {data.recentMessages?.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Belum ada pesan masuk</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentMessages?.map(m => (
                <div key={m.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === 'unread' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{m.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{m.subject || 'Tanpa subjek'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
