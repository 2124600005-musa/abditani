'use client';
import { useState } from 'react';

export default function KontakPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Gagal mengirim');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Terjadi kesalahan jaringan');
    }
  };

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="section-title">Hubungi Kami</h1>
          <p className="section-subtitle">Kami siap membantu Anda dengan pertanyaan dan kerjasama</p>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-10">
          {/* Form */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
                ✅ Pesan berhasil dikirim! Kami akan segera merespon.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
                ❌ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Masukkan nama" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="email@contoh.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="08xxxxxxxxxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subjek</label>
                  <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Perihal pesan" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pesan *</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none" placeholder="Tuliskan pesan Anda..." />
              </div>
              <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-50">{status === 'sending' ? 'Mengirim...' : 'Kirim Pesan'}</button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Informasi Kontak</h3>
              <div className="space-y-4">
                {[
                  { icon: '📍', label: 'Alamat', value: 'Jl. Pertanian No. 123, Jakarta Selatan, DKI Jakarta' },
                  { icon: '📧', label: 'Email', value: 'info@abditani.id' },
                  { icon: '📞', label: 'Telepon', value: '+62 21 1234 5678' },
                  { icon: '⏰', label: 'Jam Kerja', value: 'Senin - Sabtu: 08:00 - 17:00 WIB' },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{c.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{c.label}</p>
                      <p className="text-sm text-gray-700 mt-0.5">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Media Sosial</h3>
              <div className="flex gap-3">
                {[
                  { icon: '📘', label: 'Facebook' },
                  { icon: '📸', label: 'Instagram' },
                  { icon: '🐦', label: 'Twitter' },
                  { icon: '📺', label: 'YouTube' },
                ].map((s, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors cursor-pointer">
                    <span>{s.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">💬 Chat Langsung</h3>
              <p className="text-sm text-gray-600 mb-4">Butuh bantuan cepat? Kirim pesan langsung ke WhatsApp kami.</p>
              <a href="https://wa.me/622112345678" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                💬 Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
