'use client';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminNews() {
  const [items, setItems] = useState<Array<{id:number;title:string;excerpt:string;content:string;source:string;image:string;status:string;published_at:string}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Record<string,unknown>|null>(null);
  const [form, setForm] = useState({title:'',excerpt:'',content:'',source:'',image:'',status:'draft',published_at:''});

  const load = () => { fetch('/api/admin/news', { credentials: 'include' }).then(r => r.json()).then(setItems); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editItem ? `/api/admin/news/${editItem.id}` : '/api/admin/news';
    await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) });
    setShowForm(false); setEditItem(null); load();
  };

  const handleDelete = async (id: number) => { if (confirm('Hapus?')) { await fetch(`/api/admin/news/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  const handleEdit = (item: Record<string,unknown>) => {
    setEditItem(item);
    setForm({ title: item.title as string, excerpt: (item.excerpt as string)||'', content: (item.content as string)||'', source: (item.source as string)||'', image: (item.image as string)||'', status: (item.status as string)||'draft', published_at: (item.published_at as string)||'' });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Berita</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({title:'',excerpt:'',content:'',source:'',image:'',status:'draft',published_at:''}); }} className="btn-primary">+ Tambah</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Tambah'} Berita</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}>✕</button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Judul *</label><input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Sumber</label><input type="text" value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Contoh: Kompas, Detik" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Ringkasan</label><textarea rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Konten *</label><textarea rows={8} required value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Tulis konten berita di sini..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option>draft</option><option>published</option><option>archived</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Tanggal Publish</label><input type="datetime-local" value={form.published_at} onChange={e => setForm({...form, published_at: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <ImageUpload type="news" currentImage={form.image} onUpload={(path) => setForm({...form, image: path})} onRemove={() => setForm({...form, image: ''})} />
              <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="btn-secondary">Batal</button><button type="submit" className="btn-primary">{editItem ? 'Update' : 'Simpan'}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">Gambar</th><th className="px-4 py-3 text-left text-sm font-medium">Judul</th><th className="px-4 py-3 text-left text-sm font-medium">Sumber</th><th className="px-4 py-3 text-left text-sm font-medium">Status</th><th className="px-4 py-3 text-left text-sm font-medium">Publish</th><th className="px-4 py-3 text-left text-sm font-medium">Aksi</th></tr></thead>
          <tbody>{items.map(n => (
            <tr key={n.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{n.image ? <img src={n.image} alt="" className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 rounded bg-blue-50 flex items-center justify-center">📰</div>}</td>
              <td className="px-4 py-3 font-medium">{n.title}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{n.source || '-'}</td>
              <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${n.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{n.status}</span></td>
              <td className="px-4 py-3 text-sm text-gray-500">{n.published_at ? new Date(n.published_at).toLocaleDateString('id-ID') : '-'}</td>
              <td className="px-4 py-3"><button onClick={() => handleEdit(n)} className="text-blue-600 hover:underline text-sm mr-2">Edit</button><button onClick={() => handleDelete(n.id)} className="text-red-600 hover:underline text-sm">Hapus</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
