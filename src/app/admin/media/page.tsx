'use client';
import { useState, useEffect, useRef } from 'react';
import { Image, Upload, Trash2, Search, X, Calendar, HardDrive, Loader2 } from 'lucide-react';

interface MediaItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  contentType?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function getFilename(pathname: string): string {
  return pathname.split('/').pop() || pathname;
}

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MediaItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media', { credentials: 'include' });
      if (!res.ok) throw new Error('Gagal memuat');
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } catch {
      showToast('Gagal memuat media', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Format harus JPG, PNG, atau WebP', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran maksimal 5MB', 'error');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'media');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload gagal');
      showToast('Berhasil upload!', 'success');
      loadMedia();
    } catch {
      showToast('Gagal upload file', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (item: MediaItem) => {
    try {
      setDeleting(item.url);
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ url: item.url }),
      });

      if (!res.ok) throw new Error('Gagal hapus');
      showToast('Berhasil dihapus', 'success');
      setMedia(prev => prev.filter(m => m.url !== item.url));
    } catch {
      showToast('Gagal menghapus file', 'error');
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const filtered = media.filter(m => {
    if (!search) return true;
    const name = getFilename(m.pathname).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="p-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Media</h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          {uploading ? 'Upload...' : 'Upload File'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari media..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="animate-spin text-green-600" />
          <span className="text-gray-500 text-sm">Memuat media...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 flex flex-col items-center justify-center gap-3">
          <Image size={48} className="text-gray-300" />
          <span className="text-gray-500 text-sm">
            {search ? 'Tidak ada media ditemukan' : 'Belum ada media'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(item => (
            <div key={item.url} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
              {/* Image Preview */}
              <div className="aspect-square relative bg-gray-50">
                <img
                  src={item.url}
                  alt={getFilename(item.pathname)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/90 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white"
                  >
                    Buka
                  </a>
                  <button
                    onClick={() => setConfirmDelete(item)}
                    disabled={deleting === item.url}
                    className="bg-red-500/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleting === item.url ? '...' : 'Hapus'}
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-medium text-gray-800 truncate" title={getFilename(item.pathname)}>
                  {getFilename(item.pathname)}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <HardDrive size={10} /> {formatFileSize(item.size)}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Calendar size={10} /> {formatDate(item.uploadedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Hapus Media?</h2>
            <p className="text-sm text-gray-600 mb-4">
              File <span className="font-medium">{getFilename(confirmDelete.pathname)}</span> akan dihapus permanen.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete.url}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleting === confirmDelete.url ? (
                  <><Loader2 size={14} className="animate-spin" /> Menghapus...</>
                ) : (
                  <><Trash2 size={14} /> Hapus</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
