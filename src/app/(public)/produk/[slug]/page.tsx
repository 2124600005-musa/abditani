'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  status: string;
  image: string | null;
  location: string | null;
  supplier: string | null;
  supplier_contact: string | null;
  category_name: string | null;
  category_id: number | null;
}

export default function ProdukDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/products/' + slug).then(r => {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(d => {
      setProduct(d);
      setLoading(false);
    }).catch(() => {
      setError('Produk tidak ditemukan');
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="py-20 text-center text-gray-500">Memuat produk...</div>;
  if (error || !product) return (
    <div className="py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-gray-600 mb-4">{error || 'Produk tidak ditemukan'}</p>
      <Link href="/produk" className="btn-primary">Kembali ke Produk</Link>
    </div>
  );

  return (
    <div>
      <section className="py-10">
        <div className="container-custom">
          <div className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-600">Beranda</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/produk" className="hover:text-primary-600">Produk</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-primary-50 rounded-2xl flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
              ) : (
                <div className="flex flex-col items-center justify-center text-primary-600">
                  <span className="text-6xl">🌱</span>
                  <span className="text-lg font-bold mt-2">AbdiTani</span>
                </div>
              )}
            </div>

            <div>
              {product.category_name && (
                <span className="text-xs text-primary-600 bg-primary-50 px-3 py-1 rounded-full font-medium">{product.category_name}</span>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">{product.name}</h1>

              <div className="mt-6 p-5 bg-primary-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Harga</p>
                <p className="text-3xl font-extrabold text-primary-600">Rp {(product.price || 0).toLocaleString('id-ID')}<span className="text-sm font-normal text-gray-500">/{product.unit}</span></p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className={'text-sm px-3 py-1 rounded-full font-medium ' + (product.status === 'tersedia' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200')}>
                  {product.status === 'tersedia' ? '✓ Tersedia' : '✗ Habis'}
                </span>
                {product.stock > 0 && <span className="text-sm text-gray-500">Stok: {product.stock} {product.unit}</span>}
              </div>

              {product.description && (
                <div className="mt-6">
                  <h3 className="font-bold text-gray-900 mb-2">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                {product.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">📍</span>
                    <span className="text-gray-600">{product.location}</span>
                  </div>
                )}
                {product.supplier && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">🏢</span>
                    <span className="text-gray-600">{product.supplier}</span>
                  </div>
                )}
                {product.supplier_contact && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">📞</span>
                    <span className="text-gray-600">{product.supplier_contact}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <Link href="/kontak" className="btn-primary flex-1 text-center">Hubungi Penjual</Link>
                <Link href="/produk" className="btn-secondary">&larr; Kembali</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
