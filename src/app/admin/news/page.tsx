'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminNews() {
  const [items, setItems] = useState<Array<{id:number;title:string;slug:string;excerpt:string;content:string;source:string;image:string;status:string;published_at:string}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<{id:number}|null>(null);
  const [form, setForm] = useState({title:'',excerpt:'',content:'',source:'',image:'',status:'draft',published_at:''});

  const load = () => { fetch('/api/admin/news', { credentials: 'include' }).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editItem ? `/api/admin/news/${editItem.id}` : '/api/admin/news';
    await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(form) });
    setShowForm(false); setEditItem(null); setForm({title:'',excerpt:'',content:'',source:'',image:'',status:'draft',published_at:''}); load();
  };

  const handleDelete = async (id: number) => { if (confirm('Hapus berita ini?')) { await fetch(`/api/admin/news/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Berita</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({title:'',excerpt:'',content:'',source:'',image:'',status:'draft',published_at:''}); }} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"><Plus size={18} /> Tambah</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Tambah'} Berita</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Judul *</label><input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Ringkasan</label><textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Konten</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={6} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Sumber</label><input type="text" value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="draft">Draft</option><option value="published">Published</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Tanggal Publish</label><input type="date" value={form.published_at} onChange={e => setForm({...form, published_at: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Gambar URL</label><input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="px-4 py-2 border rounded-lg">Batal</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100"><tr>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Judul</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Sumber</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Tanggal</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Aksi</th>
          </tr></thead>
          <tbody>{items.map(n => (
            <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{n.title}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{n.source}</td>
              <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${n.status === 'published' ? 'text-green-700 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>{n.status}</span></td>
              <td className="px-6 py-4 text-sm text-gray-500">{n.published_at ? new Date(n.published_at).toLocaleDateString('id-ID') : '-'}</td>
              <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditItem(n); setForm({title:n.title,excerpt:n.excerpt||'',content:n.content||'',source:n.source,image:n.image||'',status:n.status,published_at:n.published_at?.split('T')[0]||''}); setShowForm(true); }} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><Edit2 size={14} /> Edit</button><button onClick={() => handleDelete(n.id)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14} /> Hapus</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
