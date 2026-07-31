import { MetadataRoute } from 'next';
import pool from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abditani.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${BASE_URL}/produk`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/harga-komoditas`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/edukasi`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/berita`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${BASE_URL}/teknologi`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/tentang`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/kontak`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  try {
    const [products, articles, news] = await Promise.all([
      pool.query('SELECT slug, updated_at FROM products WHERE status = $1', ['tersedia']),
      pool.query('SELECT slug, updated_at FROM articles WHERE status = $1', ['published']),
      pool.query('SELECT slug, updated_at FROM news WHERE status = $1', ['published']),
    ]);

    const productPages = products.rows.map((p: { slug: string; updated_at: string }) => ({
      url: `${BASE_URL}/produk/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const articlePages = articles.rows.map((a: { slug: string; updated_at: string }) => ({
      url: `${BASE_URL}/edukasi/${a.slug}`,
      lastModified: new Date(a.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    const newsPages = news.rows.map((n: { slug: string; updated_at: string }) => ({
      url: `${BASE_URL}/berita/${n.slug}`,
      lastModified: new Date(n.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...productPages, ...articlePages, ...newsPages];
  } catch {
    return staticPages;
  }
}
