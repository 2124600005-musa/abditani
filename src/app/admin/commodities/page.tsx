'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminCommodities() {
  const [items, setItems] = useState<Array<{id:number;name:string;icon:string;price:number;previous_price:number;unit:string;region:string;change_pct:number}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<{id:number}|null>(null);
  const [form, setForm] = useState({name:'',icon:'',price:'',previous_price:'',unit:'kg',region:'',change_pct:''});

  const load = () => { fetch('/api/admin/commodities', { credentials: 'include' }).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {...form, price: Number(form.price), previous_price: Number(form.previous_price), change_pct: Number(form.change_pct)};
    const url = editItem ? `/api/admin/commodities/${editItem.id}` : '/api/admin/commodities';
    await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(body) });
    setShowForm(false); setEditItem(null); setForm({name:'',icon:'',price:'',previous_price:'',unit:'kg',region:'',change_pct:''}); load();
  };

  const handleDelete = async (id: number) => { if (confirm('Hapus komoditas ini?')) { await fetch(`/api/admin/commodities/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Komoditas</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({name:'',icon:'',price:'',previous_price:'',unit:'kg',region:'',change_pct:''}); }} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"><Plus size={18} /> Tambah</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Tambah'} Komoditas</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Nama *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Icon (emoji)</label><input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="🌾" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Harga *</label><input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Harga Sebelumnya</label><input type="number" value={form.previous_price} onChange={e => setForm({...form, previous_price: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Satuan</label><input type="text" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Wilayah</label><input type="text" value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">% Perubahan</label><input type="number" step="0.1" value={form.change_pct} onChange={e => setForm({...form, change_pct: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
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
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Harga</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Perubahan</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Wilayah</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Aksi</th>
          </tr></thead>
          <tbody>{items.map(c => (
            <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-6 py-4 text-2xl">{c.icon}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
              <td className="px-6 py-4 text-sm font-semibold text-primary-600">Rp {Number(c.price).toLocaleString('id-ID')}</td>
              <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${c.change_pct >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>{c.change_pct >= 0 ? '+' : ''}{c.change_pct}%</span></td>
              <td className="px-6 py-4 text-sm text-gray-600">{c.region}</td>
              <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditItem(c); setForm({name:c.name,icon:c.icon||'',price:String(c.price),previous_price:String(c.previous_price),unit:c.unit,region:c.region,change_pct:String(c.change_pct)}); setShowForm(true); }} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><Edit2 size={14} /> Edit</button><button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14} /> Hapus</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
