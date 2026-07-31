import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const result = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = $1', [slug]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
