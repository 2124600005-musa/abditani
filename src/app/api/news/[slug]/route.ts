import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const result = await pool.query('SELECT * FROM news WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    const news = result.rows[0];
    const related = await pool.query('SELECT id, title, slug, image, excerpt, source, published_at FROM news WHERE id != $1 AND status = $2 LIMIT 3', [news.id, 'published']);
    return NextResponse.json({ ...news, related: related.rows });
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
