'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

export default function Kontak() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Gagal mengirim');
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) { setError((err as Error).message); }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Hubungi Kami</h1><p className="text-gray-600 mt-1">Kami siap membantu Anda</p></div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            {[
              { icon: MapPin, title: 'Alamat', text: 'Jl. Pertanian No. 123, Jakarta Selatan, DKI Jakarta 12345' },
              { icon: Phone, title: 'Telepon', text: '+62 21 1234 5678' },
              { icon: Mail, title: 'Email', text: 'info@abditani.id' },
              { icon: Clock, title: 'Jam Kerja', text: 'Senin - Jumat: 08:00 - 17:00' }
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0"><c.icon className="w-5 h-5 text-primary-600" /></div>
                  <div><h3 className="font-semibold text-gray-900 mb-1">{c.title}</h3><p className="text-sm text-gray-600">{c.text}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
              {submitted && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">Pesan berhasil dikirim!</div>}
              {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nama</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Telepon</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subjek</label><input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Pesan</label><textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={5} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" /></div>
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50"><Send className="w-4 h-4" />{loading ? 'Mengirim...' : 'Kirim Pesan'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
