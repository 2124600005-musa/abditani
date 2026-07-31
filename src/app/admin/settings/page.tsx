'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [form, setForm] = useState({site_name:'AbdiTani',tagline:'Teknologi untuk Petani, Masa Depan untuk Negeri',email:'',phone:'',address:'',facebook:'',instagram:'',twitter:'',seo_title:'',seo_description:'',seo_keywords:''});
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch('/api/admin/settings', { credentials: 'include' }).then(r => r.json()).then(setForm).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/settings', { method: 'PUT', headers: {'Content-Type':'application/json'}, credentials: 'include', body: JSON.stringify(form) });
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>
      {saved && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">Pengaturan berhasil disimpan!</div>}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Umum</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Nama Situs</label><input type="text" value={form.site_name} onChange={e => setForm({...form, site_name: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Tagline</label><input type="text" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Kontak</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Telepon</label><input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Alamat</label><textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Media Sosial</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-1">Facebook</label><input type="text" value={form.facebook} onChange={e => setForm({...form, facebook: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Instagram</label><input type="text" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Twitter</label><input type="text" value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">SEO</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Judul SEO</label><input type="text" value={form.seo_title} onChange={e => setForm({...form, seo_title: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Deskripsi SEO</label><textarea value={form.seo_description} onChange={e => setForm({...form, seo_description: e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Keywords SEO</label><input type="text" value={form.seo_keywords} onChange={e => setForm({...form, seo_keywords: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="pertanian, digital, indonesia" /></div>
          </div>
        </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700"><Save size={18} /> Simpan Pengaturan</button>
      </form>
    </div>
  );
}
