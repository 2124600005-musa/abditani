'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Building, Phone, Calendar, Package, ArrowRight, Clock } from 'lucide-react';

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
  created_at: string;
  updated_at: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  unit: string;
  image: string | null;
  category_name: string | null;
}

export default function ProdukDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/products/' + slug).then(r => {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(d => {
      setProduct(d);
      setLoading(false);
      if (d.category_id) {
        fetch('/api/products?category=' + d.category_id).then(r => r.json()).then(items => {
          if (Array.isArray(items)) {
            setRelated(items.filter((p: RelatedProduct) => p.slug !== slug).slice(0, 3));
          }
        }).catch(() => {});
      }
    }).catch(() => {
      setError('Produk tidak ditemukan');
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Memuat produk...</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-6">{error || 'Produk yang kamu cari tidak tersedia.'}</p>
        <Link href="/produk" className="btn-primary">Kembali ke Produk</Link>
      </div>
    </div>
  );

  return (
    <div>
      <section className="pt-24 pb-16">
        <div className="container-custom">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600">Beranda</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/produk" className="hover:text-primary-600">Produk</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-primary-50 rounded-2xl flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="flex flex-col items-center justify-center text-primary-600">
                  <Package className="w-16 h-16 mb-3" />
                  <span className="text-lg font-bold">AbdiTani</span>
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
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${product.status === 'tersedia' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200'}`}>
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
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{product.location}</span>
                  </div>
                )}
                {product.supplier && (
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{product.supplier}</span>
                  </div>
                )}
                {product.supplier_contact && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{product.supplier_contact}</span>
                  </div>
                )}
              </div>

              {product.updated_at && (
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Terakhir diperbarui: {new Date(product.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <Link href="/kontak" className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
                  Hubungi Penjual <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/produk" className="btn-secondary">&larr; Kembali</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Produk Terkait</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(p => (
                <Link key={p.id} href={`/produk/${p.slug}`} className="card group hover:translate-y-[-2px]">
                  <div className="relative h-40 bg-primary-50 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-10 h-10 text-primary-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{p.name}</h3>
                    <p className="text-lg font-bold text-primary-600 mt-1">Rp {(p.price || 0).toLocaleString('id-ID')}<span className="text-xs font-normal text-gray-500">/{p.unit}</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
