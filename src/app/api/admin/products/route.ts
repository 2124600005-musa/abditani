import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import slugify from 'slugify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    let q = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (search) { conditions.push('(p.name ILIKE $1 OR p.supplier ILIKE $1 OR p.location ILIKE $1)'); params.push(`%${search}%`); }
    if (conditions.length) q += ' WHERE ' + conditions.join(' AND ');
    q += ' ORDER BY p.created_at DESC';
    const result = await pool.query(q, params);
    return NextResponse.json(result.rows);
  } catch (err) { console.error(err); return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.name) return NextResponse.json({ error: 'Nama wajib' }, { status: 400 });
    if (!data.slug) data.slug = slugify(data.name, { lower: true, strict: true });
    const result = await pool.query(
      'INSERT INTO products (name,slug,category_id,description,price,unit,stock,status,image,location,supplier,supplier_contact) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id',
      [data.name, data.slug, data.category_id || null, data.description, data.price || 0, data.unit || 'pcs', data.stock || 0, data.status || 'tersedia', data.image || null, data.location, data.supplier, data.supplier_contact]
    );
    return NextResponse.json({ id: result.rows[0].id, message: 'Berhasil ditambahkan' }, { status: 201 });
  } catch (err) { console.error(err); return NextResponse.json({ error: 'Gagal menambahkan' }, { status: 500 }); }
}
