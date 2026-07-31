'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminArticles() {
  const [items, setItems] = useState<Array<{id:number;title:string;slug:string;category:string;excerpt:string;content:string;author:string;thumbnail:string;status:string;featured:boolean;read_time:string}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<{id:number}|null>(null);
  const [form, setForm] = useState({title:'',category:'',excerpt:'',content:'',author:'',thumbnail:'',status:'draft',featured:false,read_time:'5 menit'});

  const load = () => { fetch('/api/admin/articles', { credentials: 'include' }).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {...form, featured: Boolean(form.featured)};
    const url = editItem ? `/api/admin/articles/${editItem.id}` : '/api/admin/articles';
    await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(body) });
    setShowForm(false); setEditItem(null); setForm({title:'',category:'',excerpt:'',content:'',author:'',thumbnail:'',status:'draft',featured:false,read_time:'5 menit'}); load();
  };

  const handleDelete = async (id: number) => { if (confirm('Hapus artikel ini?')) { await fetch(`/api/admin/articles/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Artikel</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({title:'',category:'',excerpt:'',content:'',author:'',thumbnail:'',status:'draft',featured:false,read_time:'5 menit'}); }} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"><Plus size={18} /> Tambah</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Tambah'} Artikel</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Judul *</label><input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Kategori</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Budidaya" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Ringkasan</label><textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Konten</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={6} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Penulis</label><input type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="draft">Draft</option><option value="published">Published</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Waktu Baca</label><input type="text" value={form.read_time} onChange={e => setForm({...form, read_time: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Thumbnail URL</label><input type="text" value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="rounded" /><label className="text-sm font-medium">Artikel Unggulan</label></div>
              <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="px-4 py-2 border rounded-lg">Batal</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100"><tr>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Judul</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Kategori</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Penulis</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Aksi</th>
          </tr></thead>
          <tbody>{items.map(a => (
            <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{a.title} {a.featured && <span className="text-yellow-500 ml-1">⭐</span>}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{a.category}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{a.author}</td>
              <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'published' ? 'text-green-700 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>{a.status}</span></td>
              <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditItem(a); setForm({title:a.title,category:a.category,excerpt:a.excerpt||'',content:a.content||'',author:a.author,thumbnail:a.thumbnail||'',status:a.status,featured:a.featured,read_time:a.read_time||'5 menit'}); setShowForm(true); }} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><Edit2 size={14} /> Edit</button><button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14} /> Hapus</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
