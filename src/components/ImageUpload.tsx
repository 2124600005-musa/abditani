'use client';
import { useState } from 'react';

export default function ImageUpload({ type, currentImage, onUpload, onRemove }: { type: string; currentImage?: string; onUpload: (path: string) => void; onRemove?: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Ukuran maksimal 5MB'); return; }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { alert('Format harus JPG, PNG, atau WebP'); return; }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData, credentials: 'include' });
      const data = await res.json();
      if (res.ok) { onUpload(data.path); } else { alert(data.error || 'Gagal upload'); setPreview(null); }
    } catch (err) { alert('Upload gagal'); setPreview(null); }
    setUploading(false);
  };

  const displaySrc = preview || currentImage;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Gambar</label>
      {displaySrc ? (
        <div className="relative">
          <img src={displaySrc} alt="Preview" className="w-48 h-32 object-cover rounded-lg border" />
          <button type="button" onClick={() => { setPreview(null); onRemove?.(); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
        </div>
      ) : (
        <label className="w-48 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-400">
          <span className="text-2xl">📷</span>
          <span className="text-xs text-gray-500">{uploading ? 'Uploading...' : 'Pilih Gambar'}</span>
          <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      )}
      <p className="text-xs text-gray-400">JPG, PNG, WebP. Maks 5MB.</p>
    </div>
  );
}
