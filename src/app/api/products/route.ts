import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category_id = searchParams.get('category_id');
    const sort = searchParams.get('sort');
    let q = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;
    if (search) { conditions.push(`(p.name ILIKE $${idx} OR p.supplier ILIKE $${idx} OR p.location ILIKE $${idx})`); params.push(`%${search}%`); idx++; }
    if (category_id) { conditions.push(`p.category_id = $${idx}`); params.push(category_id); idx++; }
    if (conditions.length) q += ' WHERE ' + conditions.join(' AND ');
    if (sort === 'price-low') q += ' ORDER BY p.price ASC';
    else if (sort === 'price-high') q += ' ORDER BY p.price DESC';
    else if (sort === 'name') q += ' ORDER BY p.name ASC';
    else q += ' ORDER BY p.created_at DESC';
    const result = await pool.query(q, params);
    return NextResponse.json(result.rows);
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
