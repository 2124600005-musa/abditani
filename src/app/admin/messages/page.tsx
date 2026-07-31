'use client';
import { useEffect, useState } from 'react';

interface Msg { id: number; name: string; email: string; phone: string; subject: string; message: string; status: string; created_at: string; }

export default function AdminMessages() {
  const [items, setItems] = useState<Msg[]>([]);
  const [selected, setSelected] = useState<Msg | null>(null);

  const load = () => { fetch('/api/admin/messages', { credentials: 'include' }).then(r => r.json()).then(d => setItems(d)); };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => { if (confirm('Hapus pesan ini?')) { await fetch(`/api/admin/messages/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  const handleMarkRead = async (id: number) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: 'read' }) });
    load();
  };

  const handleView = (item: Msg) => {
    setSelected(item);
    if (item.status === 'unread') handleMarkRead(item.id);
  };

  const unreadCount = items.filter(i => i.status === 'unread').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pesan Masuk</h1>
        <p className="text-sm text-gray-500">{items.length} pesan total • {unreadCount} belum dibaca</p>
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Detail Pesan</h2><button onClick={() => setSelected(null)}>✕</button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium text-gray-500">Nama:</span> <span className="ml-2">{selected.name}</span></div>
                <div><span className="font-medium text-gray-500">Email:</span> <span className="ml-2">{selected.email}</span></div>
              </div>
              {selected.phone && <div className="text-sm"><span className="font-medium text-gray-500">Telepon:</span> <span className="ml-2">{selected.phone}</span></div>}
              <div><span className="font-medium text-gray-500 text-sm">Subjek:</span> <span className="ml-2 text-sm">{selected.subject || '-'}</span></div>
              <div><span className="font-medium text-gray-500 text-sm">Tanggal:</span> <span className="ml-2 text-sm">{selected.created_at ? new Date(selected.created_at).toLocaleString('id-ID') : '-'}</span></div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg"><p className="text-sm whitespace-pre-wrap">{selected.message}</p></div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setSelected(null)} className="btn-secondary">Tutup</button>
              <button onClick={() => { handleDelete(selected.id); setSelected(null); }} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-3 text-left text-sm font-medium w-8"></th>
            <th className="px-4 py-3 text-left text-sm font-medium">Nama</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Subjek</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Tanggal</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Aksi</th>
          </tr></thead>
          <tbody>{items.map(m => (
            <tr key={m.id} className={`border-t hover:bg-gray-50 cursor-pointer ${m.status === 'unread' ? 'bg-green-50/50' : ''}`} onClick={() => handleView(m)}>
              <td className="px-4 py-3">{m.status === 'unread' && <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>}</td>
              <td className="px-4 py-3 font-medium">{m.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{m.email}</td>
              <td className="px-4 py-3 text-sm">{m.subject || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{m.created_at ? new Date(m.created_at).toLocaleDateString('id-ID') : '-'}</td>
              <td className="px-4 py-3"><button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="text-red-600 hover:underline text-sm">Hapus</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
