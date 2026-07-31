'use client';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminTechnologies() {
  const [items, setItems] = useState<Array<{id:number;title:string;description:string;details:string;icon:string;image:string;status:string}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Record<string,unknown>|null>(null);
  const [form, setForm] = useState({title:'',description:'',details:'',icon:'',image:'',status:'draft'});

  const load = () => { fetch('/api/admin/technologies', { credentials: 'include' }).then(r => r.json()).then(setItems); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editItem ? `/api/admin/technologies/${editItem.id}` : '/api/admin/technologies';
    await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) });
    setShowForm(false); setEditItem(null); load();
  };

  const handleDelete = async (id: number) => { if (confirm('Hapus?')) { await fetch(`/api/admin/technologies/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  const handleEdit = (item: Record<string,unknown>) => {
    setEditItem(item);
    setForm({ title: item.title as string, description: (item.description as string)||'', details: (item.details as string)||'', icon: (item.icon as string)||'', image: (item.image as string)||'', status: (item.status as string)||'draft' });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teknologi</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({title:'',description:'',details:'',icon:'',image:'',status:'draft'}); }} className="btn-primary">+ Tambah</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Tambah'} Teknologi</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}>✕</button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Judul *</label><input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Icon</label><input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="emoji atau class icon" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Deskripsi Singkat</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Detail Lengkap</label><textarea rows={6} value={form.details} onChange={e => setForm({...form, details: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Penjelasan detail tentang teknologi..." /></div>
              <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option>draft</option><option>published</option><option>archived</option></select></div>
              <ImageUpload type="technologies" currentImage={form.image} onUpload={(path) => setForm({...form, image: path})} onRemove={() => setForm({...form, image: ''})} />
              <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="btn-secondary">Batal</button><button type="submit" className="btn-primary">{editItem ? 'Update' : 'Simpan'}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">Gambar</th><th className="px-4 py-3 text-left text-sm font-medium">Judul</th><th className="px-4 py-3 text-left text-sm font-medium">Deskripsi</th><th className="px-4 py-3 text-left text-sm font-medium">Status</th><th className="px-4 py-3 text-left text-sm font-medium">Aksi</th></tr></thead>
          <tbody>{items.map(t => (
            <tr key={t.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{t.image ? <img src={t.image} alt="" className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 rounded bg-purple-50 flex items-center justify-center">{t.icon || '⚙️'}</div>}</td>
              <td className="px-4 py-3 font-medium">{t.title}</td>
              <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{t.description || '-'}</td>
              <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${t.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span></td>
              <td className="px-4 py-3"><button onClick={() => handleEdit(t)} className="text-blue-600 hover:underline text-sm mr-2">Edit</button><button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline text-sm">Hapus</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
