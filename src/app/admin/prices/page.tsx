'use client';
import { useEffect, useState } from 'react';

export default function AdminPrices() {
  const [items, setItems] = useState<Array<{id:number;name:string;category_name:string;price:number;unit:string;status:string}>>([]);
  const [editItem, setEditItem] = useState<Record<string,unknown>|null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [showModal, setShowModal] = useState(false);

  const load = () => { fetch('/api/admin/products', { credentials: 'include' }).then(r => r.json()).then(setItems); };
  useEffect(() => { load(); }, []);

  const handleEdit = (item: Record<string,unknown>) => {
    setEditItem(item);
    setNewPrice(String(item.price || ''));
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!editItem) return;
    await fetch(`/api/admin/products/${editItem.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ price: Number(newPrice) }) });
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
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Update Harga</h2><button onClick={() => { setShowModal(false); setEditItem(null); }}>✕</button></div>
            <div className="space-y-4">
              <p className="text-gray-600">{editItem?.name as string}</p>
              <p className="text-sm text-gray-500">Harga lama: Rp {Number(editItem?.price).toLocaleString('id-ID')} / {editItem?.unit as string}</p>
              <div><label className="block text-sm font-medium mb-1">Harga Baru *</label><input type="number" required value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Masukkan harga baru" /></div>
              <div className="flex justify-end gap-2"><button onClick={() => { setShowModal(false); setEditItem(null); }} className="btn-secondary">Batal</button><button onClick={handleUpdate} className="btn-primary">Update Harga</button></div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">Nama</th><th className="px-4 py-3 text-left text-sm font-medium">Kategori</th><th className="px-4 py-3 text-left text-sm font-medium">Harga</th><th className="px-4 py-3 text-left text-sm font-medium">Satuan</th><th className="px-4 py-3 text-left text-sm font-medium">Status</th><th className="px-4 py-3 text-left text-sm font-medium">Aksi</th></tr></thead>
          <tbody>{items.map(p => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{p.category_name || '-'}</td>
              <td className="px-4 py-3 text-sm font-semibold">Rp {p.price?.toLocaleString('id-ID')}</td>
              <td className="px-4 py-3 text-sm">{p.unit || '-'}</td>
              <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${p.status === 'tersedia' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span></td>
              <td className="px-4 py-3"><button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-sm">Edit Harga</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
