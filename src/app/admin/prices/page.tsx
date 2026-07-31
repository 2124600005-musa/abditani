'use client';
import { useState, useEffect } from 'react';
import { Edit2, X } from 'lucide-react';

export default function AdminPrices() {
  const [items, setItems] = useState<Array<{id:number;name:string;category_name:string;price:number;unit:string;status:string}>>([]);
  const [editItem, setEditItem] = useState<{id:number;name:string;price:number}|null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [showModal, setShowModal] = useState(false);

  const load = () => { fetch('/api/admin/products', { credentials: 'include' }).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])); };
  useEffect(() => { load(); }, []);

  const handleUpdate = async () => {
    if (!editItem) return;
    await fetch(`/api/admin/products/${editItem.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, credentials: 'include', body: JSON.stringify({ price: Number(newPrice) }) });
    setShowModal(false); setEditItem(null); load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Harga</h1>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Edit Harga</h2><button onClick={() => { setShowModal(false); setEditItem(null); }}><X size={20} /></button></div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Produk: <strong>{editItem?.name}</strong></p>
              <div><label className="block text-sm font-medium mb-1">Harga Baru (Rp)</label><input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="flex justify-end gap-2"><button onClick={() => { setShowModal(false); setEditItem(null); }} className="px-4 py-2 border rounded-lg">Batal</button><button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Update Harga</button></div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100"><tr>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Produk</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Kategori</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Harga</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Aksi</th>
          </tr></thead>
          <tbody>{items.map(p => (
            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{p.category_name || '-'}</td>
              <td className="px-6 py-4 text-sm font-semibold text-primary-600">Rp {Number(p.price).toLocaleString('id-ID')}</td>
              <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'tersedia' ? 'text-green-700 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>{p.status}</span></td>
              <td className="px-6 py-4"><button onClick={() => { setEditItem(p); setNewPrice(String(p.price)); setShowModal(true); }} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><Edit2 size={14} /> Edit Harga</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
