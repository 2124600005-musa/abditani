'use client';
import { useState, useEffect } from 'react';
import { Save, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminSettings() {
  const [form, setForm] = useState({site_name:'AbdiTani',tagline:'Teknologi untuk Petani, Masa Depan untuk Negeri',email:'',phone:'',address:'',facebook:'',instagram:'',twitter:'',seo_title:'',seo_description:'',seo_keywords:''});
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { fetch('/api/admin/settings', { credentials: 'include' }).then(r => r.json()).then(setForm).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/settings', { method: 'PUT', headers: {'Content-Type':'application/json'}, credentials: 'include', body: JSON.stringify(form) });
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'Konfirmasi password tidak cocok' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'Password baru minimal 6 karakter' });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwMsg({ type: 'success', text: 'Password berhasil diubah!' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: (err as Error).message || 'Gagal mengubah password' });
    }
    setPwLoading(false);
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

      {/* Password Change */}
      <form onSubmit={handlePasswordChange} className="mt-8 max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Lock size={18} /> Ubah Password</h2>
          {pwMsg && (
            <div className={`px-4 py-3 rounded-lg mb-4 text-sm font-medium ${pwMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {pwMsg.text}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password Lama</label>
              <input type="password" required value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password Baru</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required minLength={6} value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} className="w-full border rounded-lg px-3 py-2 pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Konfirmasi Password Baru</label>
                <input type="password" required minLength={6} value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={pwLoading} className="mt-4 bg-gray-900 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50">
            <Lock size={16} /> {pwLoading ? 'Menyimpan...' : 'Ubah Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
