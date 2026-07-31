import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const result = await pool.query('SELECT * FROM articles WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    const article = result.rows[0];
    const related = await pool.query('SELECT id, title, slug, thumbnail, category, excerpt, author, read_time, created_at FROM articles WHERE category = $1 AND id != $2 AND status = $3 LIMIT 3', [article.category, article.id, 'published']);
    return NextResponse.json({ ...article, related: related.rows });
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
