'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Array<{id:number;name:string;slug:string;category_id:number;category_name:string;description:string;price:number;unit:string;stock:number;status:string;image:string|null;location:string;supplier:string;supplier_contact:string}>>([]);
  const [categories, setCategories] = useState<Array<{id:number;name:string}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<{id:number}|null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({name:'',category_id:'',description:'',price:'',unit:'kg',stock:'',status:'tersedia',image:'',location:'',supplier:'',supplier_contact:''});

  const load = () => { fetch('/api/admin/products', { credentials: 'include' }).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])); };
  const loadCategories = () => { fetch('/api/admin/categories', { credentials: 'include' }).then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])); };
  useEffect(() => { load(); loadCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {...form, price: Number(form.price), stock: Number(form.stock), category_id: Number(form.category_id) || null};
    const url = editItem ? `/api/admin/products/${editItem.id}` : '/api/admin/products';
    const method = editItem ? 'PUT' : 'POST';
    await fetch(url, { method, headers: {'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(body) });
    setShowForm(false); setEditItem(null);
    setForm({name:'',category_id:'',description:'',price:'',unit:'kg',stock:'',status:'tersedia',image:'',location:'',supplier:'',supplier_contact:''});
    load();
  };

  const handleDelete = async (id: number) => { if (!confirm('Hapus produk ini?')) return; await fetch(`/api/admin/products/${id}`, { method:'DELETE', credentials:'include' }); load(); };

  const handleEdit = (item: typeof products[0]) => {
    setEditItem(item);
    setForm({name:item.name,category_id:String(item.category_id||''),description:item.description||'',price:String(item.price),unit:item.unit,stock:String(item.stock),status:item.status,image:item.image||'',location:item.location||'',supplier:item.supplier||'',supplier_contact:item.supplier_contact||''});
    setShowForm(true);
  };

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produk</h1>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({name:'',category_id:'',description:'',price:'',unit:'kg',stock:'',status:'tersedia',image:'',location:'',supplier:'',supplier_contact:''}); }} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"><Plus size={18} /> Tambah Produk</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">{editItem ? 'Edit Produk' : 'Tambah Produk'}</h2><button onClick={() => { setShowForm(false); setEditItem(null); }}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Nama Produk *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Kategori</label><select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="">Pilih Kategori</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Deskripsi</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Harga *</label><input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Satuan</label><input type="text" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Stok</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="tersedia">Tersedia</option><option value="habis">Habis</option><option value="pre-order">Pre-order</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Lokasi</label><input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Gambar URL</label><input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Supplier</label><input type="text" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Kontak Supplier</label><input type="text" value={form.supplier_contact} onChange={e => setForm({...form, supplier_contact: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="px-4 py-2 border rounded-lg">Batal</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{editItem ? 'Update' : 'Simpan'}</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100"><tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Nama</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Kategori</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Harga</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Stok</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Aksi</th>
            </tr></thead>
            <tbody>{filtered.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4"><div className="flex items-center gap-3">{p.image ? <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 text-sm">🌱</div>}<span className="font-medium text-gray-900">{p.name}</span></div></td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.category_name || '-'}</td>
                <td className="px-6 py-4 text-sm font-semibold text-primary-600">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.stock}</td>
                <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'tersedia' ? 'text-green-700 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>{p.status}</span></td>
                <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><Edit2 size={14} /> Edit</button><button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14} /> Hapus</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
