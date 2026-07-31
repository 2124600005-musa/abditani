import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import slugify from 'slugify';

const ALLOWED_FIELDS = ['name', 'slug', 'category_id', 'description', 'price', 'unit', 'stock', 'status', 'image', 'location', 'supplier', 'supplier_contact'];

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    if (data.name && !data.slug) data.slug = slugify(data.name, { lower: true, strict: true });
    const fields = Object.keys(data).filter(k => ALLOWED_FIELDS.includes(k) && data[k] !== undefined);
    if (fields.length === 0) return NextResponse.json({ error: 'Tidak ada field diupdate' }, { status: 400 });
    const sets = fields.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const vals = fields.map(k => data[k]);
    await pool.query(`UPDATE products SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1}`, [...vals, id]);
    return NextResponse.json({ message: 'Berhasil diupdate' });
  } catch { return NextResponse.json({ error: 'Gagal update' }, { status: 500 }); }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Berhasil dihapus' });
  } catch { return NextResponse.json({ error: 'Gagal hapus' }, { status: 500 }); }
}
