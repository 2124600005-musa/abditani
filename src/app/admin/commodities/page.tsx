'use client';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminCommodities() {
  const [items, setItems] = useState<Array<{id:number;name:string;icon:string;price:number;previous_price:number;unit:string;region:string;change_pct:number}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Record<string,unknown>|null>(null);
  const [form, setForm] = useState({name:'',icon:'',price:'',previous_price:'',unit:'kg',region:'',change_pct:''});

  const load = () => { fetch('/api/admin/commodities', { credentials: 'include' }).then(r => r.json()).then(setItems); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, price: Number(form.price), previous_price: Number(form.previous_price)||0, change_pct: Number(form.change_pct)||0 };
    const url = editItem ? `/api/admin/commodities/${editItem.id}` : '/api/admin/commodities';
    await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
    setShowForm(false); setEditItem(null); load();
  };

  const handleDelete = async (id: number) => { if (confirm('Hapus?')) { await fetch(`/api/admin/commodities/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  const handleEdit = (item: Record<string,unknown>) => {
    setEditItem(item);
    setForm({ name: item.name as string, icon: (item.icon as string)||'', price: String(item.price||''), previous_price: String(item.previous_price||''), unit: (item.unit as string)||'kg', region: (item.region as string)||'', change_pct: String(item.change_pct||'') });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Komoditas</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({name:'',icon:'',price:'',previous_price:'',unit:'kg',region:'',change_pct:''}); }} className="btn-primary">+ Tambah</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Tambah'} Komoditas</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}>✕</button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nama *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Harga *</label><input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Harga Sebelumnya</label><input type="number" value={form.previous_price} onChange={e => setForm({...form, previous_price: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Satuan</label><select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option>kg</option><option>liter</option><option>ton</option><option>pack</option><option>pcs</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Daerah</label><input type="text" value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Perubahan %</label><input type="number" value={form.change_pct} onChange={e => setForm({...form, change_pct: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Icon</label><input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="emoji atau URL" /></div>
              <ImageUpload type="commodities" currentImage={form.icon} onUpload={(path) => setForm({...form, icon: path})} onRemove={() => setForm({...form, icon: ''})} />
              <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="btn-secondary">Batal</button><button type="submit" className="btn-primary">{editItem ? 'Update' : 'Simpan'}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">Icon</th><th className="px-4 py-3 text-left text-sm font-medium">Nama</th><th className="px-4 py-3 text-left text-sm font-medium">Harga</th><th className="px-4 py-3 text-left text-sm font-medium">Satuan</th><th className="px-4 py-3 text-left text-sm font-medium">Daerah</th><th className="px-4 py-3 text-left text-sm font-medium">Perubahan</th><th className="px-4 py-3 text-left text-sm font-medium">Aksi</th></tr></thead>
          <tbody>{items.map(c => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-2xl">{c.icon || '📦'}</td>
              <td className="px-4 py-3 font-medium">{c.name}</td>
              <td className="px-4 py-3 text-sm font-semibold">Rp {c.price?.toLocaleString('id-ID')}</td>
              <td className="px-4 py-3 text-sm">{c.unit || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{c.region || '-'}</td>
              <td className="px-4 py-3 text-sm"><span className={c.change_pct > 0 ? 'text-green-600' : c.change_pct < 0 ? 'text-red-600' : 'text-gray-500'}>{c.change_pct > 0 ? '+' : ''}{c.change_pct}%</span></td>
              <td className="px-4 py-3"><button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline text-sm mr-2">Edit</button><button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline text-sm">Hapus</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
