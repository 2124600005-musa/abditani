'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminCategories() {
  const [items, setItems] = useState<Array<{id:number;name:string;slug:string;description:string;icon:string;sort_order:number}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<{id:number}|null>(null);
  const [form, setForm] = useState({name:'',description:'',icon:'',sort_order:'0'});

  const load = () => { fetch('/api/admin/categories', { credentials: 'include' }).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {...form, sort_order: Number(form.sort_order)};
    const url = editItem ? `/api/admin/categories/${editItem.id}` : '/api/admin/categories';
    await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(body) });
    setShowForm(false); setEditItem(null); setForm({name:'',description:'',icon:'',sort_order:'0'}); load();
  };

  const handleDelete = async (id: number) => { if (confirm('Hapus kategori ini?')) { await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kategori</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({name:'',description:'',icon:'',sort_order:'0'}); }} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"><Plus size={18} /> Tambah</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Tambah'} Kategori</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nama *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Deskripsi</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Icon (emoji)</label><input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="🌾" /></div>
                <div><label className="block text-sm font-medium mb-1">Urutan</label><input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="px-4 py-2 border rounded-lg">Batal</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100"><tr>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Icon</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Nama</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Deskripsi</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Urutan</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Aksi</th>
          </tr></thead>
          <tbody>{items.map(c => (
            <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-6 py-4 text-2xl">{c.icon || '📦'}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{c.description || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{c.sort_order}</td>
              <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditItem(c); setForm({name:c.name,description:c.description||'',icon:c.icon||'',sort_order:String(c.sort_order)}); setShowForm(true); }} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><Edit2 size={14} /> Edit</button><button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14} /> Hapus</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
