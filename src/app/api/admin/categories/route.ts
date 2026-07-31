import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import slugify from 'slugify';

export async function GET() {
  try {
    const result = await pool.query('SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count FROM categories c ORDER BY c.sort_order');
    return NextResponse.json(result.rows);
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.name) return NextResponse.json({ error: 'Nama wajib' }, { status: 400 });
    if (!data.slug) data.slug = slugify(data.name, { lower: true, strict: true });
    const result = await pool.query('INSERT INTO categories (name,slug,description,icon,sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING id', [data.name, data.slug, data.description, data.icon, data.sort_order || 0]);
    return NextResponse.json({ id: result.rows[0].id, message: 'Berhasil' }, { status: 201 });
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
