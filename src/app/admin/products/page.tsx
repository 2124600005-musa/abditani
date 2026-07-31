'use client';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminProducts() {
  const [items, setItems] = useState<Array<{id:number;name:string;slug:string;category_id:number;category_name:string;description:string;price:number;unit:string;stock:number;status:string;image:string;location:string;supplier:string;supplier_contact:string}>>([]);
  const [categories, setCategories] = useState<Array<{id:number;name:string}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Record<string,unknown>|null>(null);
  const [form, setForm] = useState({name:'',category_id:'',description:'',price:'',unit:'kg',stock:'',status:'tersedia',image:'',location:'',supplier:'',supplier_contact:''});

  const load = () => { fetch('/api/admin/products', { credentials: 'include' }).then(r => r.json()).then(setItems); };
  const loadCats = () => { fetch('/api/admin/categories', { credentials: 'include' }).then(r => r.json()).then(setCategories); };
  useEffect(() => { load(); loadCats(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, price: Number(form.price), stock: Number(form.stock), category_id: Number(form.category_id) || null };
    const url = editItem ? `/api/admin/products/${editItem.id}` : '/api/admin/products';
    await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
    setShowForm(false); setEditItem(null); load();
  };

  const handleDelete = async (id: number) => { if (confirm('Hapus?')) { await fetch(`/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' }); load(); } };

  const handleEdit = (item: Record<string,unknown>) => {
    setEditItem(item);
    setForm({ name: item.name as string, category_id: String(item.category_id||''), description: (item.description as string)||'', price: String(item.price), unit: (item.unit as string)||'kg', stock: String(item.stock||0), status: (item.status as string)||'tersedia', image: (item.image as string)||'', location: (item.location as string)||'', supplier: (item.supplier as string)||'', supplier_contact: (item.supplier_contact as string)||'' });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produk</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({name:'',category_id:'',description:'',price:'',unit:'kg',stock:'',status:'tersedia',image:'',location:'',supplier:'',supplier_contact:''}); }} className="btn-primary">+ Tambah</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Tambah'} Produk</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}>✕</button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Nama *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Kategori</label><select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="">Pilih</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Deskripsi</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Harga *</label><input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Satuan</label><select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option>kg</option><option>pack</option><option>liter</option><option>set</option><option>pcs</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Stok</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Lokasi</label><input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option>tersedia</option><option>habis</option><option>pre-order</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Supplier</label><input type="text" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Kontak</label><input type="text" value={form.supplier_contact} onChange={e => setForm({...form, supplier_contact: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <ImageUpload type="products" currentImage={form.image} onUpload={(path) => setForm({...form, image: path})} onRemove={() => setForm({...form, image: ''})} />
              <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="btn-secondary">Batal</button><button type="submit" className="btn-primary">{editItem ? 'Update' : 'Simpan'}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">Gambar</th><th className="px-4 py-3 text-left text-sm font-medium">Nama</th><th className="px-4 py-3 text-left text-sm font-medium">Kategori</th><th className="px-4 py-3 text-left text-sm font-medium">Harga</th><th className="px-4 py-3 text-left text-sm font-medium">Stok</th><th className="px-4 py-3 text-left text-sm font-medium">Aksi</th></tr></thead>
          <tbody>{items.map(p => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{p.image ? <img src={p.image} alt="" className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 rounded bg-green-50 flex items-center justify-center">🌱</div>}</td>
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{p.category_name || '-'}</td>
              <td className="px-4 py-3 text-sm">Rp {p.price?.toLocaleString('id-ID')}</td>
              <td className="px-4 py-3 text-sm">{p.stock}</td>
              <td className="px-4 py-3"><button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-sm mr-2">Edit</button><button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-sm">Hapus</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
