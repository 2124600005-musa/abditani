'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Store, TrendingUp, GraduationCap, Cpu, MessageCircle, Handshake,
  Users, Package, MapPin, ChevronRight, Leaf, ShieldCheck, BookOpen
} from 'lucide-react';

interface Product {
  id: number; name: string; slug: string; price: number; unit: string;
  image: string | null; category_name: string | null; location: string | null;
}

interface Commodity {
  id: number; name: string; slug: string; price: number; previous_price: number;
  unit: string; region: string; change_pct: number; icon: string | null;
}

interface Article {
  id: number; title: string; slug: string; category: string; excerpt: string;
  thumbnail: string | null; author: string; read_time: string; created_at: string;
}

interface Category {
  id: number; name: string; slug: string; icon: string | null; product_count: number;
}

const featureIcons: Record<string, React.ComponentType<{className?: string}>> = { Store, TrendingUp, GraduationCap, Cpu, MessageCircle, Handshake };

const features = [
  { id: 1, icon: 'Store', title: 'Marketplace Produk', description: 'Temukan benih, pupuk, dan alat pertanian dari supplier terpercaya.' },
  { id: 2, icon: 'TrendingUp', title: 'Harga Komoditas Real-time', description: 'Pantau harga pasar terkini untuk komoditas pertanian favoritmu.' },
  { id: 3, icon: 'GraduationCap', title: 'Edukasi Pertanian', description: 'Artikel dan panduan untuk meningkatkan produktivitas lahan.' },
  { id: 4, icon: 'Cpu', title: 'Teknologi Pertanian', description: 'Solusi modern untuk pertanian masa depan.' },
  { id: 5, icon: 'MessageCircle', title: 'Konsultasi Gratis', description: 'Hubungi tim kami untuk konsultasi pertanian.' },
  { id: 6, icon: 'Handshake', title: 'Kerjasama Strategis', description: 'Jalin kemitraan dengan petani dan pelaku industri pertanian.' },
];

const stats = [
  { value: '1,000+', label: 'Petani Terdaftar' },
  { value: '50+', label: 'Produk Tersedia' },
  { value: '30+', label: 'Kabupaten Terjangkau' },
  { value: '24/7', label: 'Layanan Aktif' },
];

const trustCards = [
  { icon: ShieldCheck, title: 'Informasi Terpercaya', description: 'Data dan informasi yang akurat dari sumber terverifikasi untuk membantu keputusan petani.' },
  { icon: TrendingUp, title: 'Harga Terupdate', description: 'Pantau harga komoditas secara real-time dari berbagai pasar di Indonesia.' },
  { icon: Cpu, title: 'Teknologi Pertanian', description: 'Solusi digital modern yang dirancang khusus untuk meningkatkan produktivitas pertanian.' },
  { icon: BookOpen, title: 'Edukasi Praktis', description: 'Panduan dan artikel edukasi yang mudah dipahami dan langsung dapat diterapkan.' },
];

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AbdiTani",
  url: "https://abditani.id",
  description: "Platform digital pertanian Indonesia",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://abditani.id/produk?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AbdiTani",
  url: "https://abditani.id",
  logo: "https://abditani.id/images/abditani-logo.jpg",
  description: "Platform digital pertanian Indonesia",
};

function JsonLdScript() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
    </>
  );
}

function HeroSection() {
  return (
    <section aria-label="Hero" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
      </div>
      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Leaf className="w-4 h-4 text-primary-300" />
              <span className="text-sm text-primary-100">Platform Pertanian Digital Indonesia</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Solusi Digital untuk{' '}
              <span className="text-primary-300">Pertanian Indonesia</span>
            </h1>
            <p className="text-lg text-primary-100/80 mb-8 max-w-xl leading-relaxed">
              AbdiTani membantu petani berkembang melalui teknologi, informasi harga, akses pasar, dan inovasi pertanian berkelanjutan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/produk" className="bg-white text-primary-800 px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 flex items-center gap-2">
                Lihat Produk <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/edukasi" className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
                Jelajahi Edukasi
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section aria-label="Fitur Unggulan" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 className="section-title">Semua Kebutuhan Pertanian dalam Satu Platform</h2>
          <p className="section-subtitle mx-auto">
            AbdiTani menyediakan berbagai layanan untuk membantu petani meningkatkan produktivitas dan kesejahteraan.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = featureIcons[feature.icon] || Store;
            return (
              <article key={feature.id} className="card p-6 hover:translate-y-[-2px]">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection({ categories }: { categories: Category[] }) {
  const defaultCategories = [
    { icon: '🌱', name: 'Benih & Bibit', slug: 'benih-bibit' },
    { icon: '🧪', name: 'Pupuk & Nutrisi', slug: 'pupuk-nutrisi' },
    { icon: '🚜', name: 'Alat Pertanian', slug: 'alat-pertanian' },
    { icon: '💧', name: 'Irigasi & Hidroponik', slug: 'irigasi-hidroponik' },
    { icon: '🌾', name: 'Hasil Panen', slug: 'hasil-panen' },
    { icon: '🐛', name: 'Pestisida', slug: 'pestisida' },
    { icon: '🤖', name: 'Teknologi Pertanian', slug: 'teknologi-pertanian' },
    { icon: '🐄', name: 'Pakan Ternak', slug: 'pakan-ternak' },
  ];

  const items = categories.length > 0
    ? categories.map(c => ({ icon: c.icon || '📦', name: c.name, slug: c.slug, count: c.product_count }))
    : defaultCategories.map(c => ({ ...c, count: 0 }));

  return (
    <section aria-label="Kategori Produk" className="py-20">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 className="section-title">Kategori Produk</h2>
          <p className="section-subtitle mx-auto">Temukan berbagai kategori produk pertanian berkualitas.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((cat, i) => (
            <Link key={i} href={`/produk?kategori=${cat.slug}`} className="card p-5 text-center hover:translate-y-[-2px] group">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
              {'count' in cat && cat.count > 0 && (
                <p className="text-xs text-gray-500 mt-1">{cat.count} produk</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ products }: { products: Product[] }) {
  const placeholderProducts = [
    { id: 1, name: 'Benih Padi Unggul', slug: 'benih-padi-unggul', price: 85000, unit: 'kg', image: null, category_name: 'Benih & Bibit', location: 'Jawa Barat' },
    { id: 2, name: 'Pupuk Organik Cair', slug: 'pupuk-organik-cair', price: 45000, unit: 'liter', image: null, category_name: 'Pupuk & Nutrisi', location: 'Jawa Tengah' },
    { id: 3, name: 'Alat Semprot Premium', slug: 'alat-semprot-premium', price: 350000, unit: 'pcs', image: null, category_name: 'Alat Pertanian', location: 'DIY Yogyakarta' },
  ];

  const items = products.length > 0 ? products.slice(0, 6) : placeholderProducts;

  return (
    <section aria-label="Produk Unggulan" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="section-title">Produk Unggulan</h2>
            <p className="section-subtitle">Produk pertanian pilihan dari supplier terpercaya.</p>
          </div>
          <Link href="/produk" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <Link key={p.id} href={`/produk/${p.slug}`} className="card group hover:translate-y-[-2px]">
              <div className="relative h-48 bg-primary-50 flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-primary-600">
                    <Package className="w-10 h-10 mx-auto mb-2" />
                    <span className="text-sm font-bold">AbdiTani</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{p.category_name || 'Umum'}</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{p.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-primary-600">Rp {p.price?.toLocaleString('id-ID')}</span>
                  <span className="text-xs text-gray-500">/{p.unit}</span>
                </div>
                {p.location && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" /> {p.location}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommoditiesSection({ commodities }: { commodities: Commodity[] }) {
  const placeholderCommodities = [
    { id: 1, name: 'Padi', slug: 'padi', price: 5800, previous_price: 5650, unit: 'kg', region: 'Nasional', change_pct: 2.65, icon: '🌾' },
    { id: 2, name: 'Jagung', slug: 'jagung', price: 4200, previous_price: 4350, unit: 'kg', region: 'Nasional', change_pct: -3.45, icon: '🌽' },
    { id: 3, name: 'Kedelai', slug: 'kedelai', price: 8500, previous_price: 8500, unit: 'kg', region: 'Nasional', change_pct: 0, icon: '🫘' },
    { id: 4, name: 'Cabe Merah', slug: 'cabe-merah', price: 32000, previous_price: 28000, unit: 'kg', region: 'Nasional', change_pct: 14.29, icon: '🌶️' },
    { id: 5, name: 'Kopi', slug: 'kopi', price: 65000, previous_price: 63000, unit: 'kg', region: 'Nasional', change_pct: 3.17, icon: '☕' },
    { id: 6, name: 'Kelapa Sawit', slug: 'kelapa-sawit', price: 2850, previous_price: 2900, unit: 'kg', region: 'Nasional', change_pct: -1.72, icon: '🌴' },
  ];

  const items = commodities.length > 0 ? commodities.slice(0, 6) : placeholderCommodities;

  return (
    <section aria-label="Harga Komoditas" className="py-20">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="section-title">Harga Komoditas Hari Ini</h2>
            <p className="section-subtitle">Pantau harga pasar komoditas pertanian terkini.</p>
          </div>
          <Link href="/harga-komoditas" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <div key={c.id} className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                {c.icon || '🌾'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                <p className="text-xs text-gray-500">{c.region}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-600">Rp {c.price?.toLocaleString('id-ID')}</div>
                <div className={`text-xs font-medium ${c.change_pct > 0 ? 'text-green-600' : c.change_pct < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {c.change_pct > 0 ? '▲' : c.change_pct < 0 ? '▼' : '─'} {Math.abs(c.change_pct || 0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticlesSection({ articles }: { articles: Article[] }) {
  const placeholderArticles = [
    { id: 1, title: 'Panduan Lengkap Budidaya Padi Sawah', slug: 'panduan-budidaya-padi', category: 'Budidaya', excerpt: 'Pelajari langkah-langkah praktis budidaya padi sawah dari persiapan lahan hingga panen.', thumbnail: null, author: 'Tim AbdiTani', read_time: '8 menit' },
    { id: 2, title: 'Mengenal Hidroponik untuk Pemula', slug: 'hidroponik-pemula', category: 'Hidroponik', excerpt: 'Cara memulai bercocok tanam hidroponik di rumah dengan modal minimal.', thumbnail: null, author: 'Tim AbdiTani', read_time: '6 menit' },
    { id: 3, title: 'Pengendalian Hama Secara Organik', slug: 'pengendalian-hama-organik', category: 'Hama & Penyakit', excerpt: 'Tips mengendalikan hama tanaman menggunakan metode organik yang aman.', thumbnail: null, author: 'Tim AbdiTani', read_time: '5 menit' },
  ];

  const items = articles.length > 0 ? articles.slice(0, 3) : placeholderArticles;

  return (
    <section aria-label="Artikel & Edukasi" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="section-title">Artikel & Edukasi Pertanian</h2>
            <p className="section-subtitle">Belajar pertanian modern dari para ahli.</p>
          </div>
          <Link href="/edukasi" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((a) => (
            <Link key={a.id} href={`/edukasi/${a.slug}`} className="card group hover:translate-y-[-2px]">
              <div className="relative h-44 bg-primary-50 flex items-center justify-center">
                {a.thumbnail ? (
                  <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-primary-600">
                    <GraduationCap className="w-10 h-10 mx-auto mb-2" />
                    <span className="text-sm font-bold">AbdiTani</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{a.category}</span>
                <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-primary-600 transition-colors">{a.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{a.excerpt}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {a.author}</span>
                  <span>{a.read_time || '5 menit'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section aria-label="Mengapa AbdiTani" className="py-20">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 className="section-title">Mengapa AbdiTani?</h2>
          <p className="section-subtitle mx-auto">Alasan mengapa ribuan petani mempercayai AbdiTani.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustCards.map((card, i) => (
            <article key={i} className="card p-6 text-center hover:translate-y-[-2px]">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <card.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section aria-label="Ajakan Bertindak" className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Siap Memulai Pertanian Digital?</h2>
        <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
          Bergabung bersama ribuan petani Indonesia yang telah merasakan manfaat teknologi digital.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://wa.me/6281364083093" target="_blank" rel="noopener noreferrer" className="bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 flex items-center gap-2">
            WhatsApp Kami <ArrowRight className="w-4 h-4" />
          </a>
          <Link href="/kontak" className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
            Formulir Kontak
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/commodities').then(r => r.json()),
      fetch('/api/articles').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([prods, comms, arts, cats]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setCommodities(Array.isArray(comms) ? comms : []);
      setArticles(Array.isArray(arts) ? arts : []);
      setCategories(Array.isArray(cats) ? cats : []);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <JsonLdScript />
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection categories={categories} />
      <ProductsSection products={products} />
      <CommoditiesSection commodities={commodities} />
      <ArticlesSection articles={articles} />
      <TrustSection />
      <CTASection />
    </div>
  );
}
