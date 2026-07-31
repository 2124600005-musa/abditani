'use client';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminCategories() {
  const [items, setItems] = useState<Array<{id:number;name:string;description:string;icon:string;sort_order:number}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Record<string,unknown>|null>(null);
  const [form, setForm] = useState({name:'',description:'',icon:'',sort_order:'0'});

  const load = () => { fetch('/api/admin/categories', { credentials: 'include' }).then(r => r.json()).then(setItems); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, sort_order: Number(form.sort_order) || 0 };
    const url = editItem ? `/api/admin/categories/${editItem.id}` : '/api/admin/categories';
    await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
    setShowForm(false); setEditItem(null); load();
  };

  const handleDelete = async (id: number) => { if (confirm('Hapus?')) { await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  const handleEdit = (item: Record<string,unknown>) => {
    setEditItem(item);
    setForm({ name: item.name as string, description: (item.description as string)||'', icon: (item.icon as string)||'', sort_order: String(item.sort_order||0) });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kategori</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({name:'',description:'',icon:'',sort_order:'0'}); }} className="btn-primary">+ Tambah</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Tambah'} Kategori</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}>✕</button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nama *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Deskripsi</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Icon</label><input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="emoji atau class icon" /></div>
                <div><label className="block text-sm font-medium mb-1">Urutan</label><input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <ImageUpload type="categories" currentImage={form.icon} onUpload={(path) => setForm({...form, icon: path})} onRemove={() => setForm({...form, icon: ''})} />
              <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="btn-secondary">Batal</button><button type="submit" className="btn-primary">{editItem ? 'Update' : 'Simpan'}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">Icon</th><th className="px-4 py-3 text-left text-sm font-medium">Nama</th><th className="px-4 py-3 text-left text-sm font-medium">Deskripsi</th><th className="px-4 py-3 text-left text-sm font-medium">Urutan</th><th className="px-4 py-3 text-left text-sm font-medium">Aksi</th></tr></thead>
          <tbody>{items.map(c => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-2xl">{c.icon || '📁'}</td>
              <td className="px-4 py-3 font-medium">{c.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{c.description || '-'}</td>
              <td className="px-4 py-3 text-sm">{c.sort_order}</td>
              <td className="px-4 py-3"><button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline text-sm mr-2">Edit</button><button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline text-sm">Hapus</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
