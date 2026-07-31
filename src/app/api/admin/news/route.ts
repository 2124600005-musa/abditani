import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import slugify from 'slugify';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.title) return NextResponse.json({ error: 'Judul wajib' }, { status: 400 });
    if (!data.slug) data.slug = slugify(data.title, { lower: true, strict: true });
    const result = await pool.query('INSERT INTO news (title,slug,excerpt,content,source,image,status,published_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [data.title, data.slug, data.excerpt, data.content, data.source, data.image, data.status || 'published', data.published_at || null]);
    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
