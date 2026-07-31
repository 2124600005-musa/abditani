'use client';
import { useEffect, useState } from 'react';

export default function AdminSettings() {
  const [form, setForm] = useState({site_name:'AbdiTani',tagline:'',email:'',phone:'',address:'',facebook:'',instagram:'',twitter:'',seo_title:'',seo_description:'',seo_keywords:''});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if (data && Object.keys(data).length) setForm(prev => ({...prev, ...data})); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) });
    setSaving(false);
    alert('Pengaturan berhasil disimpan!');
  };

  if (loading) return <div className="p-6 text-center py-20 text-gray-500">Memuat...</div>;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Situs</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">Informasi Umum</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Nama Situs *</label><input type="text" required value={form.site_name} onChange={e => setForm({...form, site_name: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Tagline</label><input type="text" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Contoh: Solusi Pertanian Modern" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Telepon</label><input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Alamat</label><textarea rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">Media Sosial</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">Facebook</label><input type="text" value={form.facebook} onChange={e => setForm({...form, facebook: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="URL atau username" /></div>
            <div><label className="block text-sm font-medium mb-1">Instagram</label><input type="text" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="URL atau username" /></div>
            <div><label className="block text-sm font-medium mb-1">Twitter/X</label><input type="text" value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="URL atau username" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">SEO</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">SEO Title</label><input type="text" value={form.seo_title} onChange={e => setForm({...form, seo_title: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Judul untuk search engine" /></div>
            <div><label className="block text-sm font-medium mb-1">SEO Description</label><textarea rows={2} value={form.seo_description} onChange={e => setForm({...form, seo_description: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Deskripsi untuk search engine (150-160 karakter)" /></div>
            <div><label className="block text-sm font-medium mb-1">SEO Keywords</label><input type="text" value={form.seo_keywords} onChange={e => setForm({...form, seo_keywords: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="pertanian, hasil panen, abditani (koma dipisah)" /></div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</button>
        </div>
      </form>
    </div>
  );
}
