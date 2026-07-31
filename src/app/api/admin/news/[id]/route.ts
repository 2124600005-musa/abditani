import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import slugify from 'slugify';

const ALLOWED_FIELDS = ['title', 'slug', 'excerpt', 'content', 'source', 'image', 'status', 'published_at'];

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    if (data.title && !data.slug) data.slug = slugify(data.title, { lower: true, strict: true });
    const fields = Object.keys(data).filter(k => ALLOWED_FIELDS.includes(k) && data[k] !== undefined);
    if (fields.length === 0) return NextResponse.json({ error: 'Tidak ada field diupdate' }, { status: 400 });
    const sets = fields.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const vals = fields.map(k => data[k]);
    await pool.query(`UPDATE news SET ${sets} WHERE id = $${fields.length + 1}`, [...vals, id]);
    return NextResponse.json({ message: 'OK' });
  } catch { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM news WHERE id = $1', [id]);
    return NextResponse.json({ message: 'OK' });
  } catch { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
